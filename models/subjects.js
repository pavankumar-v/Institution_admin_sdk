import { db, adminFirestore } from "../database/firebase-admin.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../database/firebase.js";

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
  static async fetchByBranchSem(branch, sem) {
    const snapshot = await db.collection("branch/" + branch + "/" + sem).get();
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

  static async addModule(branch, sem, docId, subjectName) {
    const subjectRef = db
      .collection("branch/" + branch.toLowerCase() + "/" + sem.toString())
      .doc(docId);
    subjectRef
      .update({
        modules: adminFirestore.FieldValue.arrayUnion(subjectName),
      })
      .then((data) => {
        return 1;
      })
      .catch((err) => console.log(err));

    return -1;
  }

  static async deleteModule(branch, sem, uid, modulName) {
    const subjectRef = db
      .collection("branch/" + branch.toLowerCase() + "/" + sem.toString())
      .doc(uid);

    subjectRef
      .update({
        modules: adminFirestore.FieldValue.arrayRemove(modulName),
      })
      .then(() => {
        return 1;
      })
      .catch((err) => {
        return err;
      });
  }

  static async uploadNotes(branch, sem, docId, file) {
    var storageRef = storage.ref("notes/" + file.name);
    var task = uploadBytes(storageRef, file);
    task
      .then((snapshot) => {
        storageRef
          .getDownloadURL()
          .then((url) => {
            console.log(url);
          })
          .catch((err) => console.log(err));
        console.log(snapshot);
        console.log("file uploaded");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

export default Subject;
