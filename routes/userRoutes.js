import express from "express";
import { onAuthStateChanged } from "firebase/auth";

import {
  getIndexPage,
  getClass,
  getUsers,
  blockUser,
  getSubject,
  loadUsersByBranchSem,
  addUSN,
  delelteUser,
} from "../controllers/userController.js";
import { AdminAuth } from "../database/firebase-admin.js";

const router = express.Router();

router.all("*", (req, res, next) => {
  console.log("all");
  const claim = req.cookies.userClaim;
  const sessionCookie = req.cookies.session || "";
  AdminAuth.verifySessionCookie(sessionCookie, true)
    .then(() => {
      if (claim["admin"] || claim["staff"] || claim["hod"]) {
        next();
      } else {
        res.redirect("/signout");
      }
    })
    .catch((err) => {
      res.redirect("/signout");
    });
});
router.get("/", getIndexPage);
router.get("/classes", getClass);
router.get("/subjects", getSubject);
router.get("/users", getUsers);
router.post("/blockuser", blockUser);
router.post("/addusn", addUSN);
router.post("/loadusersbybranchsem", loadUsersByBranchSem);
router.post("/agebared", delelteUser);

export default router;
