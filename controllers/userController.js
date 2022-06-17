import { db } from "../database/firebase-admin.js";
import User from "../models/user.js";
import StaffUser from "../models/staffUser.js";
import Subject from "../models/subjects.js";
import { auth } from "../database/firebase.js";

export const getIndexPage = async (req, res) => {
  try {
    // const claim = req.cookies.userClaim;
    // const uid = req.cookies.user.user.uid;
    // const authCurUser = req.cookie.curUser;
    // console.log(authCurUser);
    // var curUser;
    // var users;
    // if (claim["admin"]) {
    //   curUser = await StaffUser.fetchAdmin(uid);
    //   users = await User.fetchAll();
    // } else if (claim["hod"]) {
    //   curUser = await StaffUser.fetchUser(uid);
    //   console.log(curUser);
    //   users = await User.fetchByBranch(curUser.data.department.toUpperCase());
    // } else {
    //   curUser = await StaffUser.fetchUser(uid);
    //   users = await User.fetchByBranchSem("CSE", 8);
    // }
    res.status(200).redirect("/dashboard");
  } catch (err) {
    console.log(err.message);
    res.send({ response: 0, message: err.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const claim = req.cookies.userClaim;
    const curUser = req.cookies.authUser;
    res.status(200).render("index", {
      title: "dashboard",
      claim,
      staff: curUser,
    });
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
    const claim = req.cookies.userClaim;
    const curUser = req.cookies.authUser;

    res.render("subjects", { title: "subjects", claim, staff: curUser });
  } catch (error) {
    res.send({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const claim = req.cookies.userClaim;
    const curUser = req.cookies.authUser;

    res.status(200).render("users", {
      title: "users",
      claim,
      staff: curUser,
      csrfToken: "",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addUSN = async (req, res) => {
  try {
    const usn = req.body.usn;
    console.log(usn);
    const task = await User.addUsn(usn);
    if (task) {
      res.send({ response: 1, message: "USN Added" });
    } else {
      res.send({ response: 0, message: "Failed!" });
    }
  } catch (err) {
    res.send({ response: 0, message: err.message });
  }
};

export const loadUsersByBranchSem = async (req, res) => {
  try {
    const claim = req.cookies.userClaim;
    const curUser = req.cookies.authUser;
    const data = req.body;
    var users;

    // // security check
    if (claim["admin"]) {
      users = await User.fetchByBranchSem(data.branch, data.sem);
    } else {
      users = await User.fetchByBranchSem(
        curUser.department.toUpperCase(),
        data.sem
      );
    }
    console.log(users);
    res.send({ response: 1, message: "Updated", users });
  } catch (err) {
    res.send({ response: 0, message: err.message });
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
