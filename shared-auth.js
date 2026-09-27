import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
import { firebaseApp } from './firebase-config.js';

export const auth = getAuth(firebaseApp);
export const observeAuth = callback => onAuthStateChanged(auth, callback);
export async function signUp(email, password, displayName) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName.trim()) await updateProfile(result.user, { displayName: displayName.trim() });
  return result.user;
}
export const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password).then(result => result.user);
export const signOutUser = () => signOut(auth);
