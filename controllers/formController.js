import DynamicForm from "../models/dynamicForm.js";

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
    console.log(data);
  } catch (error) {
    res.send({ response: 0, message: error.message });
  }
};
