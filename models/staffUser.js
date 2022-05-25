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
}

export default Staff;
