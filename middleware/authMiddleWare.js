import { AdminAuth } from "../database/firebase-admin.js";

const authCheck = (req, res, next) => {
  //   console.log("passing through auth middleware");
  const sessionCookie = req.cookies.session || "";
  AdminAuth.verifySessionCookie(sessionCookie, true)
    .then((data) => {
      AdminAuth.getUser(data.uid)
        .then((userRecord) => {
          if (
            userRecord.customClaims["hod"] ||
            userRecord.customClaims["staff"] ||
            userRecord.customClaims["admin"]
          ) {
            next();
          } else {
            res.redirect("/signout");
          }
        })
        .catch((err) => {
          res.redirect("/signout");
        });
    })
    .catch((err) => {
      res.redirect("/signout");
    });
};

export default authCheck;
