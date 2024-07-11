import { User, signOut } from "firebase/auth";
import { auth } from "./firebase";
import * as functions from 'firebase/functions';

async function handleLogout() {
    await signOut(auth);
}
