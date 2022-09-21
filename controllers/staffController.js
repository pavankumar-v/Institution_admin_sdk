import { db, AdminAuth } from "../database/firebase-admin.js";
import User from "../models/user.js";
import StaffUser from "../models/staffUser.js";
import Subject from "../models/subjects.js";
import { auth } from "../database/firebase.js";
import { sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";
import nodemailer from "nodemailer";
import { response } from "express";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "institute.app.in@gmail.com",
    pass: "ouzhusfnqzlemnwk",
  },
  from: "institute.app.in@gmail.com",
});

export const staffControl = async (req, res) => {
  try {
    var staffs = [];

    if (req.claim["admin"]) {
      staffs = await StaffUser.fetchAll();
      var adminDoc = await StaffUser.fetchAdmin(req.curUser.id);
      staffs.unshift(adminDoc.data);
    } else {
      staffs = await StaffUser.fetchByBranch(req.curUser.department);
    }

    // const subjects = await Subject.fetchByBranchSem("cse", "8");
    res.status(200).render("staffControl", {
      title: "staff control",
      claim: req.claim,
      staff: req.curUser,
      staffs,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createStaffAuth = async (req, res) => {
  try {
    const data = req.body;
    const userUid = await AdminAuth.createUser({
      email: data.email,
    })
      .then((user) => {
        return { response: 1, uid: user.uid };
      })
      .catch((err) => {
        return { response: 0, message: err.message };
      });

    if (userUid.response) {
      const addToDb = await db
        .collection("staff")
        .doc(userUid.uid)
        .set({
          fullName: data.fullName,
          department: data.department,
          designation: data.designation,
          semAssigned: data.semAssigned,
          subjectsAssigned: [],
          avatar:
            "https://firebasestorage.googleapis.com/v0/b/brindavan-student-app.appspot.com/o/assets%2Favatars%2Fteachers%2Fcdg.png?alt=media&token=a3f8fa74-1ade-4375-94d4-ef8869aea672",
        })
        .then((db) => {
          return true;
        })
        .catch((err) => {
          res.send({ response: 0, message: err.message });
        });

      if (addToDb) {
        const addClaim = await AdminAuth.setCustomUserClaims(userUid.uid, {
          staff: data.designation === "staff" ? true : false,
          hod: data.designation === "hod" ? true : false,
          admin: false,
        })
          .then(() => {
            return true;
          })
          .catch((err) => {
            console.log(err.message);
            res.send({ response: 0, message: err.message });
          });

        if (addClaim) {
          transporter.sendMail({
            from: "institute.app.in@gmail.com",
            to: data.email,
            subject: "Profile Created Successfully",
            text: `Login and continue to the futher procedure`,
            html: `
            <main style="
            background-color: #cecece;
            padding: 20px;
            color: #333;
            ">
                <div style="width: 100%;
                background-color: azure; text-align: center;">
                    <div style="background-color: #1B62DB;
                    color: #fff;
                    font-weight: Bold;
                    text-align: center;
                    padding: 18px;
                    
                    ">
                        <h1>Welcome!</h1>
                        <p style="padding: 10px; text-align: center;">
                            Your profile is been successfully created
                        </p>
        
                        <p style="text-align: center; font-weight: bold;">
                            Your Details as per created profile is
                        </p>
                    </div>
                </div>
                <div style="
                    display: grid; grid-template-column: 'column'; justify-content: center; align-items: center; width: 100%;
                    background-color: #2ECC71;
                    color: #fff;
                    font-weight: bold;
                    ">
                    <p>Name : ${data.fullName.toUpperCase()} </p>
                    <br>
                    <p>Designation :${data.designation.toUpperCase()}  </p>
                    <br>
                    <p>Department : ${data.department.toUpperCase()} </p>
                </div>
                <p style="text-align: center;">Your password is not been set, while logging in click in reset password and add
            create new password.</p>
        <p style="text-align: center;">verify email when you login.</p>
            </main>
    <h2 style="text-align: center; font-weight: bold;"></h2>
    `,
          });
          res.send({ response: 1, message: "Staff created sucessfully" });
        } else {
          res.send({
            response: 1,
            message: "something went wrong while adding claim",
          });
        }
      }
    } else {
      res.send({ response: 0, message: userUid.message });
    }
  } catch (error) {
    console.log(err.message);
    res.send({ response: 0, message: error.message });
  }
};

export const sendVerificationCode = async (req, res) => {
  try {
    const data = req.body;
    const code = Math.floor(Math.random() * 1000000);
    transporter
      .sendMail({
        from: "institute.app.in@gmail.com",
        to: data.email,
        subject: "Email Verification",
        text: `Login and continue to the futher procedure`,
        html: `
        <div style="width: 100%;
    background-color: azure; text-align: center;">
        <div style="background-color: #1B62DB;
        color: #fff;
        font-weight: Bold;
        text-align: center;
        padding: 18px;">Email Verification Code</div>
    </div>
    <p style="padding: 10px; text-align: center;">
        Do not share this code with any one
    </p>

    <p style="text-align: center; font-weight: bold;">
        Your Verification Code is
    </p>
    <h2 style="text-align: center; font-weight: bold;">${code}</h2>
    `,
      })
      .then((result) => {
        res.send({
          response: 1,
          message: "Email verification code sent",
          code: code,
        });
      })
      .catch((err) => {
        console.log(err.message);
        res.send({ response: 0, message: "Email verification code not sent" });
      });
  } catch (error) {
    res.send({ response: 0, err: "Some Error" });
  }
};

export const viewStaff = async (req, res) => {
  console.log(req.params.id);
  try {
    const data = req.params;

    var collectionName =
      req.claim["admin"] && data.id == req.curUser.id ? "admin" : "staff";
    const staffData = await StaffUser.fetchUser(data.id, collectionName);
    if (staffData.res) {
      const claim = await AdminAuth.getUser(data.id).then((user) => {
        const res = user.customClaims[staffData.data.designation];
        return res;
      });

      res.render("pages/staffView", {
        title: "Staff",
        backPath: "/staffcontrol",
        staff: staffData.data,
        you: req.curUser,
        claim,
      });
    }
  } catch (error) {
    res.send({ response: 0, message: error.message });
  }
};

// update Name
export const updateName = async (req, res) => {
  try {
    const data = req.body;
    const claim = req.cookies.userClaim;
    const curUser = req.cookies.authUser;
    var collection =
      claim["admin"] && data.docId == curUser.id ? "admin" : "staff";
    const updateName = await StaffUser.updateName(
      data.docId,
      data.newName,
      collection
    );
    if (updateName) {
      res.send({ response: 1, message: "Name updated" });
    } else {
      res.send({ response: 0, message: "Name could not be updated" });
    }
  } catch (error) {
    res.send({ response: 0, message: error.message });
  }
};

export const loadSubjects = async (req, res) => {
  try {
    const data = req.body;
    const subjects = [];
    const claim = req.cookies.userClaim;
    const curUser = req.cookies.authUser;
    var collection =
      claim["admin"] && data.docId == curUser.id ? "admin" : "staff";
    const staffData = await StaffUser.fetchUser(data.docId, collection);
    var existingSub;
    if (staffData.res) {
      existingSub = staffData.data.subjectsAssigned;
    }

    for (let i = 0; i < data.sem.length; i++) {
      var subjectData = await Subject.fetchByBranchSem(
        data.branch,
        data.sem[i]
      );
      subjects.push(subjectData);
    }

    res.send({
      response: 1,
      subjects: subjects,
      existingSub,
      message: "Subjects Loaded",
    });
  } catch (error) {
    res.send({ response: 0, message: error.message });
  }
};

export const assignSubjects = async (req, res) => {
  try {
    const data = req.body;
    const claim = req.cookies.userClaim;
    const curUser = req.cookies.authUser;
    var collection =
      claim["admin"] && data.docId == curUser.id ? "admin" : "staff";

    console.log(collection);
    const updateSubjects = await StaffUser.updateSubjects(
      data.docId,
      data.subjectsAssigned,
      data.semAssigned,
      collection
    );

    if (updateSubjects) {
      res.send({ response: 1, message: "subjects updated" });
    } else {
      res.send({ response: 0, message: "subjects could not be updated" });
    }
  } catch (error) {
    res.send({ response: 0, err: error.message });
  }
};

// delete assigned subject from array
export const deleteSubjectVal = async (req, res) => {
  try {
    const data = req.body;
    const deletSub = await StaffUser.deleteSubjectVal(
      data.docId,
      data.subValue
    );

    if (deletSub) {
      res
        .status(200)
        .send({ response: 1, message: "Subject unAssigned Successfully." });
    } else {
      res.send({ response: 0, message: "Subject could be deleted." });
    }
  } catch (error) {
    res.send({ response: 0, err: error.message });
  }
};

// delete staff user

export const deleteStaffUser = async (req, res) => {
  try {
    const id = req.body.docId;
    const deleteStaff = await StaffUser.deleteStaffUser(id);

    if (deleteStaff) {
      res
        .status(200)
        .send({ response: 1, message: "Staff deleted successfully." });
    } else {
      res.send({ response: 0, message: "Staff could not be deleted sorry!" });
    }
  } catch (error) {
    res.send({ response: 0, err: error.message });
  }
};

export const claimToggle = async (req, res) => {
  try {
    const data = req.body;
    const toggle = await StaffUser.toggleClaim(
      data.docId,
      data.claim,
      data.claimName
    );

    if (toggle) {
      res.send({ response: 1, message: "Claim set" });
    } else {
      res.send({ response: 0, message: "Operation Error" });
    }
  } catch (err) {
    res.send({ response: 0, message: err.message });
  }
};
