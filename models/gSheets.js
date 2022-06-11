import services from "../database/gSheets.js";

class Gsheet {
  constructor(spreadsheetId, sheetTitle, columns) {
    (this.spreadsheetId = spreadsheetId),
      (this.sheetTitle = sheetTitle),
      (this.columns = columns);
  }

  async createSheet() {
    try {
      const request = {
        spreadsheetId: this.spreadsheetId,
        resource: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: this.sheetTitle,
                  hidden: false,
                },
              },
            },
          ],
        },
      };
      const createSht = services.googleSheets.spreadsheets
        .batchUpdate(request)
        .then(async (data) => {
          console.log(data);
          const appendColumns = await services.googleSheets.spreadsheets.values
            .append({
              auth: services.auth,
              spreadsheetId: this.spreadsheetId,
              range: this.sheetTitle,
              valueInputOption: "USER_ENTERED",
              resource: {
                values: [this.columns],
              },
            })
            .then((data) => {
              console.log("sheet created");
              return true;
            })
            .catch((err) => {
              console.log(err.message);
              return false;
            });
          return appendColumns;
        })
        .catch((err) => {
          console.log(err.message);
          return false;
        });

      return createSht;
    } catch (error) {
      console.log(error.message);
    }
  }
}

export default Gsheet;
