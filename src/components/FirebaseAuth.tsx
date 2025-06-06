import { auth } from "@/api/firebase.config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification, updateProfile } from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email: string, password: string) => {
  await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(auth.currentUser!, {
    displayName: email.split("@")[0]
  });
}

export const doSignInWithEmailAndPassword = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
}

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

export const doSignOut = async () => {
  return await auth.signOut();
}

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser!, {
    url: `${window.location.origin}/profile`
  });
}