import { db } from "../database/firebase-admin.js";
import User from "../models/user.js";
import Subject from "../models/subjects.js";
import { auth } from "../database/firebase.js";

export const getAttendance = async (req, res) => {
  try {
    const claim = req.cookies.userClaim;
    const staff = req.cookies.authUser;
    const users = await User.fetchAll();

    res.status(200).render("attendance", {
      title: "attendance",
      users: users,
      staff,
      claim,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAttendanceDate = async (req, res) => {
  try {
    const users = new User("", "", "", "CSE", 6, "A", "");
    const data = await users.fetchSpecific();
    res.render("attendance", { title: "attendance", users: data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// LOAD SUBJECTS
export const loadAssignedSubjects = async (req, res) => {
  try {
    const data = req.body;
    const claim = req.cookies.userClaim;
    const staff = req.cookies.authUser;
    var assignedSub;

    if (claim["admin"]) {
      assignedSub = await Subject.loadAssignedSubjects(
        staff.id,
        data.branch,
        data.sem,
        "admin"
      );
    } else {
      assignedSub = await Subject.loadAssignedSubjects(
        staff.id,
        staff.department,
        data.sem,
        "staff"
      );
    }

    if (assignedSub.res) {
      res.send({ response: 1, message: "", subjects: assignedSub.subAssigned });
    } else {
      res.send({ response: 0, message: "Error" });
    }
  } catch (err) {
    console.log(err.message);
    res.send({ response: 0, message: err.message });
  }
};
