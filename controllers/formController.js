import DynamicForm from "../models/dynamicForm.js";

export const getForm = async (req, res) => {
  try {
    const forms = await DynamicForm.getAllForms();
    const claim = req.cookies.userClaim;
    const staff = req.cookies.authUser;
    res.render("dynamicForm", { title: "create form", forms, claim, staff });
  } catch (err) {
    res.send({ response: 0, message: err.message });
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
    if (result.res) {
      res.status(200).send({
        response: 1,
        message: "Form Created Successfully",
        docId: result.docId,
      });
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

export const formStateToggle = async (req, res) => {
  try {
    const data = req.body;
    const result = await DynamicForm.formStateToggle(
      data.docId,
      data.formState
    );

    if (result) {
      res.send({
        response: 1,
        message: data.formState ? "Form Disabled" : "Form Enabled",
      });
    } else {
      res.send({
        response: 0,
        message: "Operation Failed please refresh page and try.",
      });
    }
  } catch (error) {
    res.send({ response: 0, message: error.message });
  }
};

export const deleteForm = async (req, res) => {
  try {
    const data = req.body;
    const deleteForm = DynamicForm.deleteFormById(data.docId);
    if (deleteForm) {
      res.send({
        response: 1,
        message: "Form Deleted Successfully",
      });
    } else {
      res.send({
        response: 0,
        message: "Form could not be deleted!",
      });
    }
  } catch (error) {
    res.send({ response: 0, message: error.message });
  }
};
