import express from "express";
import { onAuthStateChanged } from "firebase/auth";

import {
  getDashboard,
  getClass,
  getUsers,
  blockUser,
  getSubject,
  loadUsersByBranchSem,
  addUSN,
} from "../controllers/userController.js";
import { AdminAuth } from "../database/firebase-admin.js";

const router = express.Router();

router.all("*", (req, res, next) => {
  console.log("all");
  const sessionCookie = req.cookies.session || "";
  AdminAuth.verifySessionCookie(sessionCookie, true)
    .then(() => {
      next();
    })
    .catch((err) => {
      res.redirect("/login");
    });
});
router.get("/", getDashboard);
router.get("/dashboard", getDashboard);
router.get("/classes", getClass);
router.get("/subjects", getSubject);
router.get("/users", getUsers);
router.post("/blockuser", blockUser);
router.post("/addusn", addUSN);
router.post("/loadusersbybranchsem", loadUsersByBranchSem);

export default router;
