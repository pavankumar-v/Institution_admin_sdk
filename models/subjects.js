import { db, adminFirestore, AdminAuth } from "../database/firebase-admin.js";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../database/firebase.js";
import path from "path";
import { url } from "inspector";

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

  async createNewSubject(branch, sem) {
    console.log(branch);
    const addSubject = await db
      .collection("branch/" + branch.toLowerCase() + "/" + sem)
      .add({
        name: this.name,
        id: this.subId,
        description: this.description,
        modules: [],
        notes: [],
        attendance: [],
      })
      .then((doc) => {
        console.log(doc);
        return { res: 1, uid: doc.id };
      })
      .catch((err) => {
        console.log(err.message);
        return { res: 0 };
      });

    return addSubject;
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

  static async deleteSubject(branch, sem, docId) {
    const deleteSub = await db
      .collection("branch/" + branch.toLowerCase() + "/" + sem)
      .doc(docId)
      .delete()
      .then(() => {
        return true;
      })
      .catch((err) => {
        return false;
      });

    return deleteSub;
  }

  static async fetchByBranchSem(branch, sem) {
    const snapshot = await db
      .collection("branch/" + branch.toLowerCase() + "/" + sem)
      .get();
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
      .collection("branch/" + branch.toLowerCase() + "/" + sem)
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
      .collection("branch/" + branch.toLowerCase() + "/" + sem)
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

  static async uploadNotes(branch, sem, docId, fileName, file) {
    try {
      var storageRef = ref(storage, "notes/" + fileName);
      var task = uploadBytes(storageRef, file.buffer)
        .then((snapshot) => {
          const fileUrl = getDownloadURL(storageRef)
            .then((url) => {
              db.collection("branch/" + branch.toLowerCase() + "/" + sem)
                .doc(docId)
                .set(
                  {
                    notes: adminFirestore.FieldValue.arrayUnion(url),
                  },
                  { merge: true },
                  (err) => console.log(err)
                )
                .then(() => {
                  console.log("db updated");
                  return;
                })
                .catch((err) => console.log(err.message));
              return url;
            })
            .catch((err) => console.log(err));

          return fileUrl;
        })
        .catch((err) => {
          console.log(err);
        });

      // console.log(task);

      return task;
    } catch (error) {
      console.log(error.message);
    }
  }

  static async deleteNotesByUrl(branch, sem, docId, fileName, fileUrl) {
    const deleteRef = ref(storage, "notes/" + fileName);

    const subjectRef = db
      .collection("branch/" + branch.toLowerCase() + "/" + sem)
      .doc(docId);

    const taskDelete = subjectRef
      .update({
        notes: adminFirestore.FieldValue.arrayRemove(fileUrl),
      })
      .then(() => {
        const fileDelete = deleteObject(deleteRef)
          .then(() => {
            console.log("notes deleted");
            return 1;
          })
          .catch((err) => {
            console.log(err.message);
            return 0;
          });

        return fileDelete;
      })
      .catch((err) => {
        console.log(err.message);
        return 0;
      });

    return taskDelete;
  }

  static async loadAssignedSubjects(docId, branch, sem, collectionName) {
    const result = await db
      .collection(collectionName)
      .doc(docId)
      .get()
      .then((doc) => {
        var subAssigned = doc.data().subjectsAssigned;
        subAssigned = subAssigned.filter((sub) =>
          String(sub).startsWith(`${branch.toLowerCase()}/${sem}`)
        );
        return { res: 1, subAssigned };
      })
      .catch((err) => {
        console.log(err.message);
        return { res: 0, subAssigned: [] };
      });

    return result;
  }

  // ATTENDANCE
  static async getAttendance(path, docId, date) {
    const att = await db
      .collection("branch/" + path.toLowerCase())
      .doc(docId)
      .get()
      .then((doc) => {
        const data = doc.data().attendance[date];
        if (data != undefined) {
          return { res: 1, att: data };
        } else {
          return { res: 0, att: [] };
        }
      })
      .catch((err) => {
        console.log("err" + err.message);
        return { res: 0, att: [] };
      });

    return att;
  }

  static async getAttendanceAll(path, docId) {
    const att = await db
      .collection("branch/" + path.toLowerCase())
      .doc(docId)
      .get()
      .then((doc) => {
        const data = doc.data().attendance;
        if (data != undefined) {
          return { res: 1, att: data };
        } else {
          return { res: 0, att: [] };
        }
      })
      .catch((err) => {
        console.log("err" + err.message);
        return { res: 0, att: [] };
      });

    return att;
  }

  // MARK ATTENDANCE
  static async markAttendance(path, subId, val, date) {
    console.log(path);
    console.log(subId);
    const markAttendance = await db
      .collection("branch/" + path)
      .doc(subId)
      .set(
        {
          attendance: {
            [date]: adminFirestore.FieldValue.arrayUnion(val),
          },
        },
        { merge: true }
      )
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log("error :" + err.message);
        return false;
      });

    return markAttendance;
  }

  // ALTERT ATTENDANCE
  static async alterAttendance(path, subId, remVal, addVal, date) {
    const ref = db.collection("branch/" + path).doc(subId);
    const mark = await ref
      .set(
        {
          attendance: {
            [date]: adminFirestore.FieldValue.arrayRemove(remVal),
          },
        },
        { merge: true }
      )
      .then(async () => {
        const add = await ref
          .set(
            {
              attendance: {
                [date]: adminFirestore.FieldValue.arrayUnion(addVal),
              },
            },
            { merge: true }
          )
          .then(() => {
            return true;
          })
          .catch((err) => {
            return false;
          });
        return add;
      })
      .catch((err) => {
        console.log(err.message);
        return false;
      });

    return mark;
  }
}

export default Subject;
