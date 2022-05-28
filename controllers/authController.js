import { auth } from "../database/firebase.js";
import { AdminAuth } from "../database/firebase-admin.js";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

export const signInPage = (req, res) => {
  try {
    res.render("auth/login", {
      title: "login",
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const signInUser = async (req, res) => {
  try {
    const data = req.body;
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((user) => {
        user.user
          .getIdToken()
          .then((idToken) => {
            // res.setHeader("CSRF-Token", Cookies.get("XSRF-TOKEN"));
            console.log(idToken);
            const expiresIn = 60 * 60 * 24 * 5 * 1000;
            // Cookies.get("XSRF-TOKEN");
            AdminAuth.createSessionCookie(idToken, { expiresIn })
              .then((sessionCookie) => {
                const options = { maxAge: expiresIn, httpOnly: true };
                res.cookie("session", sessionCookie, options);
                res.cookie("user", user, options);
                res.end(JSON.stringify({ status: "success" }));
              })
              .catch((err) => console.log("error ", err.message));
          })
          .catch((err) => {
            res.redirect("/login");
          });
        // if (user) {
        //   res.redirect("/dashboard");
        // } else {
        //   res.redirect("/login");
        // }
      })
      .catch((err) => {
        res.json({ message: err.message });
      });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    // console.log(req.body);
    sendPasswordResetEmail(auth, email)
      .then((re) => {
        res.send({
          response: 1,
          data: "Password reset mail successfully sent",
        });
      })
      .catch((err) => {
        // console.log(err.message);
        res.send({ response: 0, err: err.message });
      });
  } catch (error) {
    // console.log(error.message);
    res.send({ response: 0, err: error.message });
  }
};

export const signoutUSer = async (req, res) => {
  try {
    res.clearCookie("session");
    auth
      .signOut()
      .then((data) => {
        console.log("sign out" + data);
        res.redirect("/login");
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};
