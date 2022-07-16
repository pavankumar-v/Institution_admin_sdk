import { db } from "../database/firebase-admin.js";
import Notification from "../models/notification.js";
import Staff from "../models/staffUser.js";
import { auth } from "../database/firebase.js";

export const getNotificationPage = async (req, res) => {
  try {
    const claim = req.cookies.userClaim;
    const curUser = req.cookies.authUser;
    var collection = claim["admin"] ? "admin" : "staff";
    const staff = await Staff.fetchUser(curUser.id, collection);
    res.status(200).render("notification", {
      title: "notifications",
      claim,
      staff: staff.data,
    });
  } catch (err) {
    console.log(err.message);
    res.send({ response: 0, message: err.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const data = req.body;
    const staff = req.cookies.authUser;
    const staffData =
      staff.designation == "Admin"
        ? await Staff.fetchAdmin(staff.id)
        : await Staff.fetchUser(staff.id, "staff");
    const newPost = new Notification(
      "",
      staff.id,
      staffData.data.fullName,
      staffData.data.designation == "ALL"
        ? "Principle"
        : staffData.data.designation,
      staffData.data.department == "Admin" ? "" : staffData.data.department,
      data.tags,
      data.title,
      data.desc,
      new Date().toISOString(),
      staffData.data.avatar
    );
    const createPost = await newPost.createNotification();
    if (createPost.res) {
      res.send({ response: 1, message: "post created", uid: createPost.id });
    } else {
      res.send({
        response: 0,
        message: "post could not be created",
        uid: createPost.id,
      });
    }
  } catch (err) {
    res.send({ response: 0, message: err.message });
  }
};

export const loadNotification = async (req, res) => {
  try {
    const claim = req.cookies.userClaim;
    const staff = req.cookies.authUser;
    const data = req.body;
    const notifications = await Notification.featchNotification(
      data.dataId,
      staff.id,
      staff.department,
      staff.designation
    );
    res.send({ response: 1, message: "Updated", notifications, claim });
  } catch (err) {
    console.log(err.message);
    res.send({ response: 0, message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const data = req.body;
    const staff = req.cookies.authUser;
    console.log(staff);
    const del = await Notification.deletePost(data.docId, staff.department);
    if (del) {
      res.send({ response: 1, message: "post deleted" });
    } else {
      res.send({ response: 0, message: "post could not be deleted" });
    }
  } catch (err) {
    res.send({ response: 0, message: err.message });
  }
};
