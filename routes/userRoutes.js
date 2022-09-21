import express from "express";

import {
  getIndexPage,
  getUsers,
  blockUser,
  loadUsersByBranchSem,
  addUSN,
  delelteUser,
  getUsnList,
  allowToRegister,
  deleteUsn,
} from "../controllers/userController.js";

import curAuth from "../middleware/curAuth.js";

const router = express.Router();

router.get("/", getIndexPage);
router.get("/users", curAuth, getUsers);
router.post("/blockuser", blockUser);
router.post("/addusn", addUSN);
router.get("/loadusersbybranchsem/:branch/:sem", curAuth, loadUsersByBranchSem);
router.delete("/deleteUser", delelteUser);
router.get("/usnList/:branch", getUsnList);
router.put("/updateUsn/:branch/:usn", allowToRegister);
router.delete("/deleteUsn/:branch/:usn", deleteUsn);

export default router;
