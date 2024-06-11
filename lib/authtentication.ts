import { signOut } from "firebase/auth";
import { auth } from "./firebase";

async function handleLogout() {
    await signOut(auth);
}
