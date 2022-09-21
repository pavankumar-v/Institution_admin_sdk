import User from "../models/user.js";
import Subject from "../models/subjects.js";
import Staff from "../models/staffUser.js";

export const getAttendance = async (req, res) => {
  try {
    const users = await User.fetchAll();
    var collectionName = req.claim["admin"] ? "admin" : "staff";
    const staff = await Staff.fetchUser(req.curUser.id, collectionName);

    res.status(200).render("attendance", {
      title: "attendance",
      users: users,
      staff: staff.data,
      claim: req.claim,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// LOAD SUBJECTS
export const loadAssignedSubjects = async (req, res) => {
  try {
    const data = req.body;

    var assignedSub;

    if (req.claim["admin"]) {
      assignedSub = await Subject.loadAssignedSubjects(
        req.curUser.id,
        data.branch,
        data.sem,
        "admin"
      );
    } else {
      assignedSub = await Subject.loadAssignedSubjects(
        req.curUser.id,
        req.curUser.department,
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
    const usnStr = data.usn + "-" + data.time + "-" + data.state;

    const markAtt = await Subject.markAttendance(
      path,
      data.subId,
      usnStr,
      data.date
    );

    if (markAtt) {
      res.send({
        response: 1,
        message: "marked attendance",
        usnStr,
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
    console.log(data);
    const path = getPath(data.branch, data.sem);
    const newUsnStr = toggleUsnStr(data.state, data.usnStr);

    const reMark = await Subject.alterAttendance(
      path,
      data.subId,
      data.usnStr,
      newUsnStr,
      data.date
    );

    console.log(reMark);

    if (reMark) {
      res.send({ response: 1, message: "attendance updated", newUsnStr });
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

function toggleUsnStr(state, remVal) {
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
