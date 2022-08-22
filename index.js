// import csurf from "csurf";
import cookieParser from "cookie-parser";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";

import authentication from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import DynamicForm from "./routes/dynamicFormRoutes.js";
import notification from "./routes/notificationRoute.js";
import dashboard from "./routes/dashboardRoutes.js";
import events from "./routes/eventsRoute.js";

// INITIALIZE EXPRESS APP
// const csrfMiddleware = csurf({ cookie: true });
const app = express();

// // register view engine
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
// app.use(csrfMiddleware);
app.use(cors());

app.use(authentication);

app.use(userRoutes);
app.use(dashboard);
app.use(notification);
app.use(attendanceRoutes);
app.use(staffRoutes);
app.use(subjectRoutes);
app.use(DynamicForm);
app.use(events);

//404 error
app.use((req, res) => {
  res.status(404).render("404");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server running at port : ${PORT}`));
