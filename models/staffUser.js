import { db } from "../database/firebase-admin.js";

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
    const staff = await db.collection("staff").doc(id).get();
    const subjects = [];
    // staff.data().subjectAssigned.forEach(async (ref) => {
    //   const document = await ref.get();
    //   const
    // });
    return staff;
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
}

export default Staff;
