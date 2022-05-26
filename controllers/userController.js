import { db } from "../database/firebase-admin.js";
import User from "../models/user.js";
import StaffUser from "../models/staffUser.js";
import { auth } from "../database/firebase.js";

export const getIndexPage = async (req, res) => {
  try {
    res.status(200).redirect("/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

export const getDashboard = async (req, res) => {
  try {
    const users = await User.fetchAll();
    res.status(200).render("index", { title: "dashboard", users: users });
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

export const getUsers = async (req, res) => {
  try {
    const staff = await StaffUser.fetchUser("RXnSNdihGAsxEsx637OS");
    const path = staff.data().subjectAssigned[0]._path.segments;
    var str = "";
    path.forEach((ele) => {
      str += "/" + ele;
    });

    console.log(staff.data().subjectAssigned[0]);
    const users = await User.fetchAll();
    res.status(200).render("users", { title: "users", users: users });
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
