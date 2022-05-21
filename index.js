import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

//Routes
import authentication from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import { auth } from "./database/firebase.js";

// INITIALIZE EXPRESS APP
const app = express();

// // register view engine
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use(authentication);
app.use(userRoutes);
app.use(attendanceRoutes);

//404 error
app.use((req, res) => {
  res.status(404).render("404");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server running at port : ${PORT}`));

// const db = require("./database/db").db;
// const userRoutes = require("./routes/userRoutes");
// // express app
// const app = express();

// // register view engine
// app.set("view engine", "ejs");

// // middleware & static files
// app.use(express.static("public"));
// app.use(express.urlencoded({ extended: true }));

// app.use("/dashboard", async (req, res) => {
//   const snapshot = await db.collection("notifications").get();
//   const users = snapshot.docs.map((doc) => doc.data());

//   console.log(users);
//   res.render("dashboard", { title: "dashboard", users: users });
// });

// app.get("/", (req, res) => {
//   res.render("index", { response: "" });
// });

// app.get("/classes", (req, res) => {
//   res.render("class");
// });
// app.get("/attendance", (req, res) => {
//   res.render("attendance");
// });

// app.post("/create", (req, res) => {
//   const data = req.body;
//   db.collection("blog")
//     .listDocuments()
//     .then((result) => {
//       result.map((val) => {
//         val.delete();
//       });
//       res.redirect("/");
//     })
//     .catch((err) => console.log(err));
// });

// app.get("/about", (req, res) => {
//   res.render("about");
// });

// // AJAX REQUEST
// app.post("/request", (req, res) => {
//   // res.redirect('/about');
//   db.collection("test")
//     .doc("test")
//     .add({
//       name: req.body.name,
//       designation: req.body.designation,
//     })
//     .then((result) => {
//       res.json([
//         {
//           name_received: req.body.name,
//           designation_received: req.body.designation,
//         },
//       ]);
//     })
//     .catch((err) => console.log(err));
// });

// app.get("/get", (req, res) => {
//   db.collection("test")
//     .get()
//     .then((data) => {
//       res.render("about", { response: data });
//     })
//     .catch((err) => console.log(err));
// });

// //404 error
// app.use((req, res) => {
//   res.status(404).render("404");
// });

// app.listen(3000);
