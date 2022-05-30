import Subject from "../models/subjects.js";
import { auth } from "../database/firebase.js";

export const loadSubjects = async (req, res) => {
  try {
    const data = req.body;
    const subjects = await Subject.fetchByBranchSem(
      data.branch != null ? data.branch : "cse",
      data.sem.toString()
    );
    // console.log(subjects);
    res.send({ response: 1, subjects: subjects });
  } catch (error) {
    console.log(error.message);
  }
};

export const addModule = async (req, res) => {
  try {
    const data = req.body;
    Subject.addModule(data.branch, data.sem, data.uid, data.moduleName)
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
