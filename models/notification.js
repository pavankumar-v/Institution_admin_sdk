import { adminFirestore, db } from "../database/firebase-admin.js";
import { AdminAuth } from "../database/firebase-admin.js";

class Notification {
  constructor(
    id,
    posterId,
    fullName,
    designation,
    department,
    tags,
    title,
    description,
    createdAt,
    avatar
  ) {
    (this.id = id),
      (this.posterId = posterId),
      (this.fullName = fullName),
      (this.designation = designation),
      (this.department = department);
    (this.tags = tags),
      (this.title = title),
      (this.description = description),
      (this.createdAt = createdAt),
      (this.avatar = avatar);
  }

  async createNotification() {
    const addNotification = await db
      .collection("notifications")
      .add({
        posterId: this.posterId,
        fullName: this.fullName,
        position: this.designation,
        department: this.department,
        tags: this.tags,
        title: this.title,
        description: this.description,
        createdAt: this.createdAt,
        avatar: this.avatar,
      })
      .then((data) => {
        console.log(data.id);
        return { res: 1, id: data.id };
      })
      .catch((err) => {
        console.log(err.message);
        return { res: 0, id: "" };
      });

    return addNotification;
  }

  static async featchNotification(dataId, docId, branch, designation) {
    console.log("data ID", dataId);
    var filedName;
    var matchStr;
    var condition;
    if (dataId == "all") {
      filedName = "tags";
      matchStr = "all";
      condition = "array-contains";
    } else if (dataId == "branch") {
      filedName = "tags";
      console.log(branch);
      matchStr = branch.toLowerCase();
      condition = "array-contains";
    } else {
      filedName = "posterId";
      matchStr = docId;
      condition = "==";
    }

    var snapshot;

    if (dataId == "branch" && branch == "ALL") {
      snapshot = await db.collection("notifications").get();
    } else if (dataId == "branch" && designation == "hod") {
      snapshot = await db
        .collection("notifications")
        .where("department", "==", branch.toUpperCase())
        .orderBy("createdAt", "desc")
        .get();
    } else {
      snapshot = await db
        .collection("notifications")
        .where(filedName, condition, matchStr)
        .orderBy("createdAt", "desc")
        .get();
    }
    const notif = snapshot.docs.map((doc) => {
      const notification = new Notification(
        doc.id,
        doc.data().posterId,
        doc.data().fullName,
        doc.data().position,
        doc.data().department,
        doc.data().tags,
        doc.data().title,
        doc.data().description,
        doc.data().createdAt
      );
      return notification;
    });

    return notif;
  }

  static async fetchByTag(tag) {
    const snapshot = await db
      .collection("notifications")
      .where("tags", "array-contains", tag)
      .orderBy("createdAt", "desc")
      .get();

    const notif = snapshot.docs.map((doc) => {
      const notification = new Notification(
        doc.id,
        doc.data().posterId,
        doc.data().fullName,
        doc.data().position,
        doc.data().department,
        doc.data().tags,
        doc.data().title,
        doc.data().description,
        doc.data().createdAt
      );
      return notification;
    });

    return notif;
  }

  static async deletePost(id) {
    return db
      .collection("notifications")
      .doc(id)
      .delete()
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }
}

export default Notification;
