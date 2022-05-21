import express from "express";
import {
  signInPage,
  signInUser,
  signoutUSer,
} from "../controllers/authController.js";

const router = express.Router();
router.get("/login", signInPage);
router.post("/login", signInUser);
router.get("/signout", signoutUSer);

export default router;
