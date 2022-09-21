import User from "../models/user.js";

// @GET gets dashboard page
export const getIndexPage = async (req, res) => {
  try {
    res.status(200).redirect("/dashboard");
  } catch (err) {
    console.log(err.message);
    res.send({ response: 0, message: err.message });
  }
};

// @GET gets user page
export const getUsers = async (req, res) => {
  try {
    res.status(200).render("users", {
      title: "users",
      claim: req.claim,
      staff: req.curUser,
      csrfToken: "",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @POST adds usn to databse
export const addUSN = async (req, res) => {
  try {
    const usn = req.body.usn;
    const curUser = req.cookies.authUser;
    const task = await User.addUsn(usn, curUser.department.toLowerCase());
    if (task) {
      res.send({ response: 1, message: "USN Added" });
    } else {
      res.send({ response: 0, message: "Failed!" });
    }
  } catch (err) {
    res.send({ response: 0, message: err.message });
  }
};

// @GET gets users by branch and sem
export const loadUsersByBranchSem = async (req, res) => {
  try {
    const data = req.params;
    console.log(data.branch, data.sem);
    var students;

    // // security check
    if (req.claim["admin"]) {
      students = await User.fetchByBranchSem(data.branch, data.sem);
    } else {
      students = await User.fetchByBranchSem(
        req.curUser.department.toUpperCase(),
        data.sem
      );
    }

    if (students.res) {
      res.send({ response: 1, message: "Updated", users: students.users });
    } else {
      res.send({
        response: 0,
        message: "could not load",
        users: students.users,
      });
    }
  } catch (err) {
    res.send({ response: 0, message: err.message });
  }
};

// @POST disables user from accessing the app
export const blockUser = async (req, res) => {
  try {
    const data = req.body;
    const result = await User.blockUser(data.uid, data.active);
    res.send({ response: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Delete deletes user
export const delelteUser = async (req, res) => {
  try {
    const data = req.body;
    const delUser = await User.deleteStudent(data.docId);
    if (delUser) {
      res.send({ response: 1, message: "User Deleted" });
    } else {
      res.send({ response: 0, message: "User Could Not be Deleted" });
    }
  } catch (err) {
    res.send({ response: 0, message: err.message });
  }
};

// @GET get usn list
export const getUsnList = async (req, res) => {
  try {
    const data = req.params;
    const usnList = await User.getUsnList(data.branch.toLowerCase());
    if (usnList != false) {
      res.send({ response: 1, message: "List Updated", usnList });
    } else {
      res.send({ response: 0, message: "error in accessing" });
    }
  } catch (err) {
    console.log(err);
    res.send({ response: 0, message: "Error Try again" });
  }
};

// @POST allow student to register again
export const allowToRegister = async (req, res) => {
  try {
    const data = req.params;
    const update = await User.updateUsn(data.branch.toLowerCase(), data.usn);
    if (update) {
      res.send({ response: 1, message: "usn updated", update });
    } else {
      res.send({ response: 0, message: "could not update" });
    }
  } catch (err) {
    console.log(err);
    res.send({ response: 0, message: "Error Try again" });
  }
};

// @DElete delete usn from db

export const deleteUsn = async (req, res) => {
  try {
    const data = req.params;
    const deleteUsn = await User.deleteUsn(
      data.branch.toLowerCase(),
      data.usn.toLowerCase()
    );

    if (delelteUser) {
      res.send({ response: 1, message: "Usn deleted", deleteUsn });
    } else {
      res.send({ response: 0, message: "Usn could not be deleted" });
    }
  } catch (err) {
    console.log(err);
    res.send({ response: 0, message: "Error Try again" });
  }
};
