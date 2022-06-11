import { google } from "googleapis";

// export const authentication = async () => {
//   const auth = new google.auth.GoogleAuth({
//     keyFile: "credentials.json",
//     scopes: "https://www.googleapis.com/auth/apreadsheets",
//   });

//   const client = await auth.getClient();

//   const googleSheets = google.sheets({
//     version: "v4",
//     auth: client,
//   });

//   return { googleSheets };
// };

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const client = await auth.getClient();

//create client instance for auth
const googleSheets = google.sheets({
  version: "v4",
  auth: client,
});

const services = {
  auth,
  googleSheets,
};

export default services;
