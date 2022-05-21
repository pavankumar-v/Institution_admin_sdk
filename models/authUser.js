import { auth } from "../database/firebase.js";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
class AuthUser {
  constructor(id, email) {
    this.id = id;
    this.email = email;
  }

  // authChanges(auth) {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       console.log(user.uid);
  //       return user.uid;
  //     }
  //     return "null";
  //   });
  // }
}

export default AuthUser;
