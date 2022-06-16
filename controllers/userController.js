import { db } from "../database/firebase-admin.js";
import User from "../models/user.js";
import StaffUser from "../models/staffUser.js";
import Subject from "../models/subjects.js";
import { auth } from "../database/firebase.js";

const user = async () => {
  const id = auth.currentUser;
  const users = await StaffUser.fetchUser(id);
  return users;
};

export const getIndexPage = async (req, res) => {
  try {
    res.status(200).redirect("/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

export const getDashboard = async (req, res) => {
  try {
    console.log(user);
    res.status(200).render("index", { title: "dashboard" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getClass = async (req, res) => {
  try {
    res.status(200).render("class", { title: "classes" });
  } catch (error) {
    res.status(400).render("class", { title: "ERROR IN DASHBOARD", users: [] });
  }
};

export const getSubject = async (req, res) => {
  try {
    res.render("subjects", { title: "subjects" });
  } catch (error) {
    res.send({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.fetchAll();
    res.status(200).render("users", {
      title: "users",
      users: users,
      csrfToken: "",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const data = req.body;
    const result = await User.blockUser(data.uid, data.active);
    res.send({ response: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
