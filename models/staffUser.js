import { adminFirestore, db } from "../database/firebase-admin.js";
import { AdminAuth } from "../database/firebase-admin.js";

class Staff {
  constructor(
    id,
    fullName,
    department,
    designation,
    semAssigned,
    subjectsAssigned,
    avatar
  ) {
    this.id = id;
    this.fullName = fullName;
    this.department = department;
    this.designation = designation;
    this.semAssigned = semAssigned;
    this.subjectsAssigned = subjectsAssigned;
    this.avatar = avatar;
  }

  static async fetchUser(id) {
    const snapshot = db.collection("staff").doc(id);
    const doc = await snapshot.get();
    if (doc.exists) {
      const staff = new Staff(
        doc.id,
        doc.data().fullName,
        doc.data().department,
        doc.data().designation,
        doc.data().semAssigned,
        doc.data().subjectsAssigned,
        doc.data().avatar
      );

      return { res: 1, data: staff };
    } else {
      return { res: 0 };
    }
  }

  static async fetchAdmin(id) {
    const snapshot = db.collection("admin").doc(id);
    const doc = await snapshot.get();
    if (doc.exists) {
      const staff = new Staff(
        doc.id,
        doc.data().fullName,
        doc.data().department,
        doc.data().designation,
        doc.data().semAssigned,
        doc.data().subjectsAssigned,
        doc.data().avatar
      );

      return { res: 1, data: staff };
    } else {
      return { res: 0 };
    }
  }

  static async fetchAll() {
    const snapshot = await db.collection("staff").get();
    const staffs = snapshot.docs.map((doc) => {
      const staff = new Staff(
        doc.id,
        doc.data().fullName,
        doc.data().department,
        doc.data().designation,
        doc.data().semAssigned,
        doc.data().subjectsAssigned,
        doc.data().avatar
      );
      return staff;
    });

    return staffs;
  }
  static async fetchByBranch(branch) {
    const snapshot = await db
      .collection("staff")
      .where("department", "==", branch.toUpperCase())
      .get();
    const staffs = snapshot.docs.map((doc) => {
      const staff = new Staff(
        doc.id,
        doc.data().fullName,
        doc.data().department,
        doc.data().designation,
        doc.data().semAssigned,
        doc.data().subjectsAssigned,
        doc.data().avatar
      );
      return staff;
    });

    return staffs;
  }

  static async updateName(docId, newName) {
    const nameUpdate = await db
      .collection("staff")
      .doc(docId)
      .update({
        fullName: newName,
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err.message);
        return false;
      });

    return nameUpdate;
  }

  static async updateSubjects(docId, assignSubjects, assignSem) {
    const updateSubjects = await db
      .collection("staff")
      .doc(docId)
      .update({
        semAssigned: assignSem,
        subjectsAssigned: assignSubjects,
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err.message);
        return false;
      });

    return updateSubjects;
  }

  // delete subject in assigned subject
  static async deleteSubjectVal(docId, subVal) {
    const deleteSub = await db
      .collection("staff")
      .doc(docId)
      .update({
        subjectsAssigned: adminFirestore.FieldValue.arrayRemove(subVal),
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err.message);
        return false;
      });

    return deleteSub;
  }

  // Delete STAFF USER
  static async deleteStaffUser(docId) {
    const deleteStaff = await db
      .collection("staff")
      .doc(docId)
      .delete()
      .then(async () => {
        const authDelete = await AdminAuth.deleteUser(docId)
          .then(() => {
            return true;
          })
          .catch((err) => {
            console.log(err.message);
            return false;
          });
        return authDelete;
      })
      .catch((err) => {
        return false;
      });

    return deleteStaff;
  }

  static async toggleClaim(docId, claim, claimName) {
    const setClaim = await AdminAuth.setCustomUserClaims(
      docId,
      claimName === "staff"
        ? {
            staff: !claim,
          }
        : {
            hod: !claim,
          }
    )
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err.message);
        return false;
      });

    return setClaim;
  }
}

export default Staff;
