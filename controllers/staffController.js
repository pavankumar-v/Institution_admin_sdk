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
    const staffs = await StaffUser.fetchAll();
    const subjects = await Subject.fetchByBranchSem("cse", "8");
    res
      .status(200)
      .render("staffControl", { title: "staff control", staffs: staffs });
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
        console.log(err.message);
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
          console.log(db);
          return true;
        })
        .catch((err) => {
          console.log(err.message);
          res.send({ response: 0, message: err.message });
        });

      if (addToDb) {
        const addClaim = await AdminAuth.setCustomUserClaims(userUid.uid, {
          staff: data.department == "staff" ? true : false,
          hod: data.department == "hod" ? true : false,
          // admin: false,
        })
          .then((claim) => {
            console.log(claim);
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
        console.log(result);
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
  try {
    const data = req.body;
    console.log(data.docId);
    const staffData = await StaffUser.fetchUser(data.docId);
    console.log(staffData);
    if (staffData.res) {
      res.render("usable/staffCard", {
        title: "Staff",
        backPath: "/staffcontrol",
        staff: staffData.data,
      });
    }
  } catch (error) {
    res.send({ response: 0, message: error.message });
  }
};

export const loadSubjects = async (req, res) => {
  try {
    const data = req.body;
    const subjects = [];
    console.log(data);
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
      message: "Loading Subjects..",
    });
  } catch (error) {
    res.send({ response: 0, err: "Some Error" });
  }
};
