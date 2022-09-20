import { db } from "../database/firebase-admin.js";
import User from "../models/user.js";
import Subject from "../models/subjects.js";
import { auth } from "../database/firebase.js";
import Staff from "../models/staffUser.js";

export const getAttendance = async (req, res) => {
  try {
    const claim = req.cookies.userClaim;
    const users = await User.fetchAll();

    const curUser = req.cookies.authUser;
    var collection = claim["admin"] ? "admin" : "staff";
    const staff = await Staff.fetchUser(curUser.id, collection);

    res.status(200).render("attendance", {
      title: "attendance",
      users: users,
      staff: staff.data,
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
      res.send({
        response: 1,
        message: "",
        subjects: assignedSub.subAssigned,
      });
    } else {
      res.send({ response: 0, message: "Error", users: [] });
    }
  } catch (err) {
    console.log(err.message);
    res.send({ response: 0, message: err.message });
  }
};

export const loadAttUsers = async (req, res) => {
  try {
    const data = req.body;
    const path = getPath(data.branch, data.sem);
    if (data.docId != null) {
      const att = await Subject.getAttendance(path, data.docId, data.date);
      const users = await User.fetchByBranchSem(data.branch, data.sem);

      res.send({
        response: 1,
        message: "Updated",
        attendance: att.att,
        users: users.users,
      });
    } else {
      res.send({ response: 1, att: [], users: [] });
    }
  } catch (err) {
    console.log(err.message);
    res.send({ response: 0, message: err.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const data = req.body;
    const path = getPath(data.branch, data.sem);
    const val = data.usn + "-" + data.time + "-" + data.state;

    const markAtt = await Subject.markAttendance(
      path,
      data.subId,
      val,
      data.date
    );

    console.log(markAtt);

    if (markAtt) {
      res.send({
        response: 1,
        message: "marked attendance",
        usnStr: val,
        time: data.time,
      });
    } else {
      res.send({ response: 0, message: "could not mark attendance" });
    }
  } catch (err) {
    console.log(err.message);
    res.send({ response: 0, message: err.message });
  }
};
export const markAttendanceTest = async (req, res) => {
  try {
    const data = req.body;
    const path = getPath(data.branch, data.sem);
    const val = data.usn + "-" + data.time + "-" + data.state;

    await Subject.markAttendanceTest();

    if (1) {
      res.send({
        response: 1,
        message: "marked attendance",
        usnStr: val,
        time: data.time,
      });
    } else {
      res.send({ response: 0, message: "could not mark attendance" });
    }
  } catch (err) {
    console.log(err.message);
    res.send({ response: 0, message: err.message });
  }
};

export const reMarkAtt = async (req, res) => {
  try {
    const data = req.body;
    const path = getPath(data.branch, data.sem);
    const addUsnStr = addVal(data.state, data.usnStr);

    const reMark = await Subject.alterAttendance(
      path,
      data.subId,
      data.usnStr,
      addUsnStr,
      data.date
    );

    if (reMark) {
      res.send({ response: 1, message: "attendance updated", addUsnStr });
    }
  } catch (err) {
    console.log(err.message);
    res.send({ response: 0, message: err.message });
  }
};

function getPath(branch, sem) {
  const path = branch + "/" + sem;
  return path.toLowerCase();
}

function addVal(state, remVal) {
  var n = remVal.length - 1;
  String.prototype.replaceAt = function (index, replacement) {
    return (
      this.substring(0, index) +
      replacement +
      this.substring(index + replacement.length)
    );
  };
  const addStr = remVal.replaceAt(n, state ? "1" : "0");
  return addStr;
}
