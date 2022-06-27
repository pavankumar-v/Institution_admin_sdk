import { db } from "../database/firebase-admin.js";
import { AdminAuth } from "../database/firebase-admin.js";
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

  static async getCount() {
    const count = await db
      .collection("users")
      .get()
      .then((doc) => {
        return doc.size;
      })
      .catch((err) => {
        console.log(err);
        return 0;
      });

    return count;
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

  static async fetchByBranch(branch) {
    const snapshot = await db
      .collection("users")
      .where("branch", "==", branch)
      .get();
    const users = snapshot.docs.map((doc) => {
      return doc.data();
    });
    return users;
  }
  static async fetchByBranchSem(branch, sem) {
    const loadUsers = await db
      .collection("users")
      .where("branch", "==", branch)
      .where("sem", "==", parseInt(sem))
      .get()
      .then((data) => {
        const users = data.docs.map((doc) => {
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
        return { res: 1, users };
      })
      .catch((err) => {
        console.log(err.message);
        return { res: 0, users: [] };
      });

    // const users = snapshot.docs.map((doc) => {
    //   const user = new User(
    //     doc.id,
    //     doc.data().fullName,
    //     doc.data().usn,
    //     doc.data().branch,
    //     doc.data().sem,
    //     doc.data().section,
    //     doc.data().avatar,
    //     doc.data().isActive
    //   );
    //   return user;
    // });
    return loadUsers;
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

  static async addUsn(usn) {
    const addUsn = db
      .collection("usncollection")
      .doc("mq6CKVtsEqBoCJvMyeQQ")
      .set(
        {
          [usn.toLowerCase()]: false,
        },
        { merge: true }
      )
      .then(() => {
        return true;
      })
      .catch((err) => {
        return false;
      });

    return addUsn;
  }

  // Delete STAFF USER
  static async deleteStudent(docId) {
    const authDelete = await AdminAuth.deleteUser(docId)
      .then(async () => {
        const deleteUser = await db
          .collection("users")
          .doc(docId)
          .delete()
          .then(async () => {
            return true;
          })
          .catch((err) => {
            console.log(err.message);
            return false;
          });
        return deleteUser;
      })
      .catch((err) => {
        console.log(err.message);
        return false;
      });

    return authDelete;
  }
}

export default User;
