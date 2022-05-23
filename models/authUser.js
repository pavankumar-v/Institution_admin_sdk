import { auth } from "../database/firebase.js";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
class AuthUser {
  constructor(id, email) {
    this.id = id;
    this.email = email;
  }
}

export default AuthUser;
