import Subject from "../models/subjects.js";
import { auth } from "../database/firebase.js";

export const loadSubjects = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

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
