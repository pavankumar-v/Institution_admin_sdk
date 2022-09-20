import express from "express";

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
  // console.log("all");
  const sessionCookie = req.cookies.session || "";
  AdminAuth.verifySessionCookie(sessionCookie, true)
    .then((data) => {
      AdminAuth.getUser(data.uid)
        .then((userRecord) => {
          if (
            userRecord.customClaims["hod"] ||
            userRecord.customClaims["staff"] ||
            userRecord.customClaims["admin"]
          ) {
            next();
          } else {
            res.redirect("/signout");
          }
        })
        .catch((err) => {
          res.redirect("/signout");
        });
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
