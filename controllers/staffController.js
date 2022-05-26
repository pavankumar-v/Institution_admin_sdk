import { db, AdminAuth } from "../database/firebase-admin.js";
import User from "../models/user.js";
import StaffUser from "../models/staffUser.js";
import { auth } from "../database/firebase.js";
import { sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";
import nodemailer from "nodemailer";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "institute.app.in@gmail.com",
    pass: "stoptheparty@123App",
  },
  from: "institute.app.in@gmail.com",
});

function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

export const staffControl = async (req, res) => {
  try {
    // console.log(auth.currentUser);
    const staffs = [];
    res.status(200).render("staffControl", { title: "staff control", staffs });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createStaffAuth = async (req, res) => {
  try {
    const password = generatePassword();
    const data = req.body;
    if (data.email) {
      AdminAuth.createUser({ email: data.email, password: password })
        .then((user) => {
          const uid = user.uid;
          db.collection("staff")
            .doc(uid)
            .set({
              fullName: data.fullName,
              department: data.department,
              designation: data.designation,
              semAssigned: data.semAssigned,
              subjectsAssigned: [],
              avatar:
                "https://firebasestorage.googleapis.com/v0/b/brindavan-student-app.appspot.com/o/assets%2Favatars%2Fteachers%2Fcdg.png?alt=media&token=a3f8fa74-1ade-4375-94d4-ef8869aea672",
            })
            .then((data) => {
              res.send({ response: 1, data: data });
            })
            .catch((err) => res.send({ response: 0, data: err.message }));

          // sendPasswordResetEmail(auth, user.email)
          //   .then((re) => {
          //     console.log(re);
          //     console.log("password reset mail sent");
          //   })
          //   .catch((err) => {
          //     console.log(err.message);
          //   });
          // AdminAuth.setCustomUserClaims(user.uid, {
          //   staff: true,
          //   hod: true,
          //   admin: false,
          // })
          //   .then((claim) => {
          //     console.log(claim);
          //     console.log("custom claim set successfully");
          //   })
          //   .catch((err) => console.log(err));
          // console.log(user);
          // transporter
          //   .sendMail({
          //     from: "institute.app.in@gmail.com",
          //     to: req.body.email,
          //     subject: "Welcome to the Institution App",
          //     text: `Login and continue to the futher procedure`,
          //     html: `<p style="background: #fff; color: #333; padding: 10px; font-size: 16px; font-weight: 400;">we suggest you to change your password for security reasons
          //     for current login please use this temp password </p><br />
          //     <h4>${password}<h4/>
          //   `,
          //   })
          //   .then((result) => {
          //     console.log(result);
          //     res.send({ response: "password sent" });
          //   })
          //   .catch((err) => {
          //     console.log(err.message);
          //   });
        })
        .catch((err) => res.send({ response: 0, data: err.message }));
    }
  } catch (error) {
    res.send({ response: 0, data: error.message });
  }
};
