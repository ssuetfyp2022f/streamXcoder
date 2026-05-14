import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GithubAuthProvider } from "firebase/auth";

const auth = getAuth();
const githubProvider = new GithubAuthProvider();

// Signup Function
export const signup = async (email, password) => {
  return await createUserWithEmailAndPassword(auth,email,password);
};

// Login Function
export const login = async (email, password) => {
  return await signInWithEmailAndPassword(auth,email,password);
};

// GitHub Login
export const loginWithGithub = () => {
  return signInWithPopup(auth, githubProvider);
};