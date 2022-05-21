import { db } from "../database/firebase-admin.js";

class Subject {
  constructor(id, subId, name, description, modules, notes, attendance) {
    this.id = id;
    this.subId = subId;
    this.name = name;
    this.description = description;
    this.modules = modules;
    this.notes = notes;
    this.attendance = attendance;
  }

  static async fetchAll() {
    const snapshot = await db.collection("branch/cse/8").get();
    const subjects = snapshot.docs.map((doc) => {
      const subjectsData = new Subject(
        doc.id,
        doc.data().id,
        doc.data().name,
        doc.data().description,
        doc.data().modules,
        doc.data().notes,
        doc.data().attendance
      );

      return subjectsData;
    });

    return subjects;
  }
}

export default Subject;
