import Subject from "../models/subjects.js";
import path from "path";

export const getSubject = async (req, res) => {
  try {
    res.render("subjects", {
      title: "subjects",
      claim: req.claim,
      staff: req.curUser,
    });
  } catch (error) {
    res.send({ message: error.message });
  }
};

export const loadSubjects = async (req, res) => {
  try {
    const data = req.body;
    const subjects = await Subject.fetchByBranchSem(
      data.branch != null ? data.branch : "cse",
      data.sem.toString()
    );
    res.send({ response: 1, message: "Updated", subjects: subjects });
  } catch (err) {
    res.send({ response: 0, message: err.message });
  }
};

export const addNewSubject = async (req, res) => {
  try {
    const data = req.body;
    var branch;

    if (req.claim["admin"]) {
      branch = data.branch;
    } else {
      branch = req.curUser.department;
    }

    const addSubject = await Subject.createNewSubject(
      data.name,
      data.subId,
      data.description,
      branch,
      data.sem
    );
    if (addSubject.res) {
      res.send({
        response: 1,
        message: "New Subject Added",
        docId: addSubject.uid,
      });
    } else {
      res.send({ response: 0, message: "subject could not be added" });
    }
  } catch (err) {
    console.log(err.message);
    res.send({ response: 0, message: err.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const data = req.body;
    const del = await Subject.deleteSubject(data.branch, data.sem, data.docId);

    if (del) {
      res.send({ response: 1, message: "Subject Deleted" });
    } else {
      res.send({ response: 0, message: "Subject could not be Deleted" });
    }
  } catch (err) {
    res.send({ response: 0, message: err.message });
  }
};

export const addModule = async (req, res) => {
  try {
    const data = req.body;
    Subject.addModule(
      data.branch.toLowerCase(),
      data.sem,
      data.uid,
      data.moduleName
    )
      .then(() => {
        res.send({ response: 1, message: "Module Added" });
      })
      .catch((err) => {
        res.send({
          response: 0,
          message: err.message,
        });
      });
  } catch (error) {
    res.send({ response: 0, message: "Error Module could not be added - 2" });
  }
};

export const deleteModule = (req, res) => {
  try {
    const data = req.body;
    Subject.deleteModule(data.branch, data.sem, data.uid, data.moduleName)
      .then(() => {
        res.send({ response: 1, message: "deleted successfully" });
      })
      .catch((err) => {
        res.send({ response: 0, message: err.message });
      });
  } catch (error) {
    res.send({ response: 0, message: error.message });
  }
};

export const addNotes = async (req, res) => {
  try {
    var data = req.body;
    var file = req.file;
    const fileName =
      data.newName != ""
        ? data.newName + path.extname(file.originalname)
        : file.originalname;
    var validate = fileValidate(
      file,
      path.extname(file.originalname).toString()
    );

    if (validate == 1) {
      const url = await Subject.uploadNotes(
        data.branch,
        data.sem,
        data.docId,
        fileName,
        file
      );

      if (url) {
        res.send({
          response: 1,
          url: url,
          fileName: fileName,
          message: "Notes uploaded successfully",
        });
      } else {
        res.send({ response: 0, message: "Notes ucould not be uploaded" });
      }
    } else if (validate == 2) {
      res.send({ response: 0, message: "File exceeds 30 mb please check" });
    } else if (validate == 3) {
      res.send({ response: 0, message: "File type not supported" });
    } else {
      res.send({ response: 0, message: "Error uploading file" });
    }
  } catch (err) {
    res.send({ response: 0, message: err.message });
  }
};

export const deleteNotes = async (req, res) => {
  try {
    const data = req.body;
    var myRegexp = /.+(\/|%2F)(.+)\?.+/g;
    var fileName = myRegexp.exec(data.notesUrl)[2];
    fileName = fileName.replace(/%20/g, " ");

    const result = await Subject.deleteNotesByUrl(
      data.branch,
      data.sem,
      data.docId,
      fileName,
      data.notesUrl
    );
    if (result) {
      res.send({ response: 1, message: "Notes deleted successfully" });
    } else {
      res.send({ response: 0, message: "operation failed" });
    }
  } catch (err) {
    res.send({ response: 0, message: err.message });
  }
};

function fileValidate(file, fileType) {
  // size validation
  if (file.size > 31457280) {
    return 2;
  }

  if (
    !(
      fileType == ".pdf" ||
      fileType == ".docx" ||
      fileType == ".doc" ||
      fileType == ".pptx" ||
      fileType == ".ppt" ||
      fileType == ".ppt" ||
      fileType == ".csv" ||
      fileType == ".png" ||
      fileType == ".jpg" ||
      fileType == ".jpeg"
    )
  ) {
    return 3;
  }

  return 1;
}
