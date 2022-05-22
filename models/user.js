import { db } from "../database/firebase-admin.js";

class User {
  constructor(id, fullName, usn, branch, sem, section, avatar, isActive) {
    this.id = id;
    this.fullName = fullName;
    this.usn = usn;
    this.branch = branch;
    this.sem = sem;
    this.section = section;
    this.avatar = avatar;
    this.isActive = isActive;
  }

  static async fetchAll() {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map((doc) => {
      const user = new User(
        doc.id,
        doc.data().fullName,
        doc.data().usn,
        doc.data().branch,
        doc.data().sem,
        doc.data().section,
        doc.data().avatar,
        doc.data().isActive
      );

      return user;
    });
    return users;
  }

  async fetchSpecific() {
    console.log(this.section);
    console.log(this.sem);
    console.log(this.branch);
    const snapshot = await db
      .collection("users")
      .where("branch", "==", this.branch)
      .where("section", "==", this.section)
      .where("sem", "==", parseInt(this.sem))
      .get();
    const users = snapshot.docs.map((doc) => {
      return doc.data();
    });
    return users;
  }
  static async blockUser(uid, str) {
    var res;
    if (str == "1") {
      await db
        .collection("users")
        .doc(uid)
        .update({
          isActive: false,
        })
        .then(() => {
          res = 0;
        });
    } else {
      await db
        .collection("users")
        .doc(uid)
        .update({
          isActive: true,
        })
        .then(() => {
          res = 1;
        });
    }
    return res;
  }
}

export default User;
