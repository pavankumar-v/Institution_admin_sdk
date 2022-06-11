import { db } from "../database/firebase-admin.js";
import Gsheet from "./gSheets.js";

class DynamicForm {
  constructor(
    id,
    name,
    description,
    spreadsheetId,
    sheetTitle,
    form,
    isActive,
    createdAt
  ) {
    (this.id = id),
      (this.name = name),
      (this.description = description),
      (this.spreadsheetId = spreadsheetId),
      (this.sheetTitle = sheetTitle),
      (this.form = form),
      (this.isActive = isActive),
      (this.createdAt = createdAt);
  }

  async createForm() {
    try {
      var columns = [];
      for (let i = 0; i < this.form.length; i++) {
        columns.push(this.form[i]["fieldName"]);
      }

      const task = await new Gsheet(
        this.spreadsheetId,
        this.sheetTitle,
        columns
      ).createSheet();

      if (task) {
        const addForm = await db
          .collection("global")
          .add({
            name: this.name,
            description: this.description,
            formId: this.spreadsheetId,
            sheetName: this.sheetTitle,
            form: this.form,
            isActive: this.isActive,
            createdAt: this.createdAt,
          })
          .then((data) => {
            return true;
          })
          .catch((err) => {
            console.log(err);
            return false;
          });

        return addForm;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  static async getAllForms() {
    const snapshot = await db.collection("global").get();
    const forms = snapshot.docs.map((doc) => {
      var val = doc.data();
      const formData = new DynamicForm(
        doc.id,
        val.name,
        val.description,
        val.formId,
        val.sheetName,
        val.form,
        val.isActive,
        val.createdAt
      );

      return formData;
    });

    return forms;
  }
}

export default DynamicForm;
