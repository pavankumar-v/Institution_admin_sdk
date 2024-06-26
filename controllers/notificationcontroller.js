import Notification from "../models/notification.js";
import Staff from "../models/staffUser.js";

export const getNotificationPage = async (req, res) => {
  try {
    var collection = req.claim["admin"] ? "admin" : "staff";
    const staff = await Staff.fetchUser(req.curUser.id, collection);
    res.status(200).render("notification", {
      title: "notifications",
      claim: req.claim,
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
    const staff = req.curUser;
    const staffData = req.claim["admin"]
      ? await Staff.fetchAdmin(staff.id)
      : await Staff.fetchUser(staff.id, "staff");
    const notificationPost = new Notification(
      "",
      staff.id,
      staffData.data.fullName,
      req.claim["admin"] ? "Principle" : staffData.data.designation,
      req.claim["amdin"] ? "" : staffData.data.department,
      data.tags,
      data.title,
      data.desc,
      new Date().toISOString(),
      staffData.data.avatar
    );
    const createPost = await notificationPost.createNotification();

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
    const data = req.body;
    const notifications = await Notification.featchNotification(
      data.dataId,
      req.curUser.id,
      req.curUser.department,
      req.curUser.designation
    );
    res.send({
      response: 1,
      message: "Updated",
      notifications,
      claim: req.claim,
      staff: req.curUser,
    });
  } catch (err) {
    console.log(err.message);
    res.send({ response: 0, message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const data = req.body;
    const deletePost = await Notification.deletePost(
      data.docId,
      req.curUser.department
    );
    if (deletePost) {
      res.send({ response: 1, message: "post deleted" });
    } else {
      res.send({ response: 0, message: "post could not be deleted" });
    }
  } catch (err) {
    res.send({ response: 0, message: err.message });
  }
};
