import { db } from "../database/firebase-admin.js";

class DynamicForm {
  constructor(
    id,
    name,
    description,
    formId,
    sheetName,
    form,
    isActive,
    createdAt
  ) {
    (this.id = id),
      (this.name = name),
      (this.description = description),
      (this.formId = formId),
      (this.sheetName = sheetName),
      (this.form = form),
      (this.isActive = isActive),
      (this.createdAt = createdAt);
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
