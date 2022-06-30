import User from "../models/user.js";
import Staff from "../models/staffUser.js";
import Subject from "../models/subjects.js";
import service from "../models/machineLearning.js";
import Notification from "../models/notification.js";

export const getDashboard = async (req, res) => {
  try {
    const claim = req.cookies.userClaim;
    const curUser = req.cookies.authUser;
    const userCount = await User.getCount();
    const staffCount = await Staff.getCount();

    console.log(userCount);
    res.status(200).render("index", {
      title: "dashboard",
      claim,
      userCount,
      staffCount,
      staff: curUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loadAttendanceChart = async (req, res) => {
  try {
    const data = req.body;
    const staff = req.cookies.authUser;
    const claim = req.cookies.userClaim;
    var collection = claim["admin"] ? "admin" : "staff";
    console.log(data);
    const assignedSub = await Subject.loadAssignedSubjects(
      staff.id,
      staff.designation == "Admin"
        ? data.branch.toLowerCase()
        : staff.department,
      data.sem,
      collection
    );

    console.log(assignedSub);

    var attendanceData = {};

    for (let sub of assignedSub.subAssigned) {
      const subSplit = sub.split("/");
      console.log("break point");
      const path = getPath(subSplit[0], subSplit[1]);
      const att = await Subject.getAttendanceAll(path, subSplit[2]);
      attendanceData[subSplit[4]] = att.att;
    }
    res.send({ response: 1, message: "", attendanceData });
  } catch (err) {
    res.send({ response: 0, message: err.message });
  }
};

export const machineLearn = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    service.model
      .fit(service.xs, service.ys, { epochs: 50 })
      .then(() => {
        console.log("trained data");
        const preval = service.model.predict(
          service.tf.tensor(
            [
              parseInt(data.hrsStudied),
              parseInt(data.prevSemMarks),
              parseInt(data.avgInternal),
              parseInt(data.assMarks),
              parseInt(data.absDays),
            ],
            [1, 5]
          )
        );
        res.send({
          response: 1,
          message: "Predicted output updated",
          op: preval.dataSync(),
          xs: service.xs,
        });
      })
      .catch((err) => {
        console.log(err.message);
        res.send({ response: 0, message: res.message, op: "Error" });
      });
  } catch (err) {
    res.send({ response: 0, message: err.message });
  }
};

export const loadNotificationByTags = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const notifications = await Notification.fetchByTag(data.tag);
    res.send({ response: 1, message: "notifcation updated", notifications });
  } catch (err) {
    res.send({ response: 0, message: err.message });
  }
};

function getPath(branch, sem) {
  const path = branch + "/" + sem;
  return path.toLowerCase();
}
