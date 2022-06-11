import DynamicForm from "../models/dynamicForm.js";
import { google } from "googleapis";

export const getForm = async (req, res) => {
  try {
    const forms = await DynamicForm.getAllForms();
    res.render("dynamicForm", { title: "create form", forms });
  } catch (error) {
    console.log(error.message);
  }
};

export const createForm = async (req, res) => {
  try {
    const data = req.body;
    const spreadSheetId = data.formUrl.split("/")[5];
    const createForm = new DynamicForm(
      "",
      data.formName,
      data.description,
      spreadSheetId,
      data.sheetName,
      data.form,
      data.isChecked,
      new Date().toISOString()
    );

    const result = await createForm.createForm();

    console.log(result);
    if (result) {
      res
        .status(200)
        .send({ response: 1, message: "Form Created Successfully" });
    } else {
      res.send({
        response: 0,
        message: "Task failed! Please check with sheet name or URL",
      });
    }
  } catch (error) {
    res.send({ response: 0, message: error.message });
  }
};
