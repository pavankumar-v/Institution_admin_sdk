import { auth } from "../database/firebase.js";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

export const signInPage = (req, res) => {
  try {
    res.render("auth/login", { title: "login" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const signInUser = async (req, res) => {
  try {
    const data = req.body;
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((user) => {
        // const userCred = new AuthUser(user.uid, user.email);
        if (user) {
          res.redirect("/dashboard");
        } else {
          res.redirect("/login");
        }
      })
      .catch((err) => {
        res.json({ message: err.message });
      });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const signoutUSer = async (req, res) => {
  try {
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
