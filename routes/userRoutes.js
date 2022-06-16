import express from "express";
import { onAuthStateChanged } from "firebase/auth";

import {
  getDashboard,
  getClass,
  getUsers,
  blockUser,
  getSubject,
} from "../controllers/userController.js";
import { AdminAuth } from "../database/firebase-admin.js";

import { auth } from "../database/firebase.js";

const router = express.Router();

router.all("*", (req, res, next) => {
  console.log("all");
  const sessionCookie = req.cookies.session || "";
  const userCookie = req.cookies.user;
  // console.log(userCookie.customClaims);
  AdminAuth.verifySessionCookie(sessionCookie, true)
    .then(() => {
      next();
    })
    .catch((err) => {
      console.log(err.message);
      res.redirect("/login");
    });
});
router.get("/", getDashboard);
router.get("/dashboard", getDashboard);
router.get("/classes", getClass);
router.get("/subjects", getSubject);
router.get("/users", getUsers);
router.post("/blockuser", blockUser);

export default router;
