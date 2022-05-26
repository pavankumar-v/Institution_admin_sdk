import express from "express";
import {
  signInPage,
  signInUser,
  signoutUSer,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();
router.get("/login", signInPage);
router.post("/login", signInUser);
router.post("/resetpassword", resetPassword);
router.get("/signout", signoutUSer);

export default router;
