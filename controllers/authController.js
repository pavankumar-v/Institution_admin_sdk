import { auth } from "../database/firebase.js";
import { AdminAuth } from "../database/firebase-admin.js";
import StaffUser from "../models/staffUser.js";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

export const signInPage = (req, res) => {
  try {
    res.render("auth/login", {
      title: "login",
      csrfToken: "",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const signInUser = async (req, res) => {
  try {
    const data = req.body;
    const expiresIn = 60 * 60 * 24 * 1 * 1000;
    const options = { maxAge: expiresIn, httpOnly: true };
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(async (user) => {
        const claims = await user.user.getIdTokenResult((idTokenResult) => {
          return idTokenResult.claims;
        });

        if (
          claims.claims["admin"] ||
          claims.claims["staff"] ||
          claims.claims["hod"]
        ) {
          var curUser;

          if (claims.claims["admin"]) {
            console.log("admin");
            curUser = await StaffUser.fetchAdmin(user.user.uid);
          } else {
            console.log("staff or hod");
            curUser = await StaffUser.fetchUser(user.user.uid);
          }
          curUser = curUser.data;
          res.cookie("authUser", curUser, options);
          user.user
            .getIdToken()
            .then((idToken) => {
              // res.setHeader("CSRF-Token", Cookies.get("XSRF-TOKEN"));
              // Cookies.get("XSRF-TOKEN");
              AdminAuth.createSessionCookie(idToken, { expiresIn })
                .then(async (sessionCookie) => {
                  res.cookie("session", sessionCookie, options);
                  res.cookie("user", user, options);

                  res.cookie("userClaim", claims.claims, options);
                  res.send({ response: 1, message: "login success" });
                })
                .catch((err) => {
                  res.send({ response: 0, message: err.message });
                });
            })
            .catch((err) => {
              res.send({ response: 0, message: err.message });
            });
        } else {
          res.send({ response: 0, message: "could not login!" });
        }
      })
      .catch((err) => {
        res.send({ response: 0, message: err.message });
      });
  } catch (err) {
    res.send({ response: 0, message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    sendPasswordResetEmail(auth, email)
      .then((re) => {
        res.send({
          response: 1,
          data: "Password reset mail successfully sent",
        });
      })
      .catch((err) => {
        res.send({ response: 0, err: err.message });
      });
  } catch (error) {
    res.send({ response: 0, err: error.message });
  }
};

export const signoutUSer = async (req, res) => {
  try {
    res.clearCookie("session");
    res.clearCookie("user");
    res.clearCookie("userClaim");
    res.clearCookie("authUser");
    auth
      .signOut()
      .then((data) => {
        res.redirect("/login");
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};
