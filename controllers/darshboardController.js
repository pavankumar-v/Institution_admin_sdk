import User from "../models/user.js";
import Subject from "../models/subjects.js";

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

export const loadAttendanceChart = async (req, res) => {
  try {
    const data = req.body;
    const staff = req.cookies.authUser;

    const assignedSub = await Subject.loadAssignedSubjects(
      staff.id,
      staff.department,
      data.sem,
      "staff"
    );

    var attendanceData = {};

    for (let sub of assignedSub.subAssigned) {
      const subSplit = sub.split("/");
      console.log("break point");
      const path = getPath(subSplit[0], subSplit[1]);
      const att = await Subject.getAttendanceAll(path, subSplit[2]);
      attendanceData[subSplit[4]] = att.att;
    }

    console.log(attendanceData);

    res.send({ response: 1, message: "", attendanceData });
  } catch (err) {
    res.send({ response: 0, message: err.message });
  }
};

function getPath(branch, sem) {
  const path = branch + "/" + sem;
  return path.toLowerCase();
}
