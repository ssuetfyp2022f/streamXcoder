import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

// create user
export const addUser = async () => {

}

// update user

// retrieve user
export const getUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));

  const usersData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    role: doc.role,
    ...doc.data(),
  }));

  return usersData;
};

// for admin role
export const getUserByEmail = async (email) => {
  const q = query(collection(db, "users"), where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) return null;

  const doc = querySnapshot.docs[0];

  return {
    id: doc.id,
    ...doc.data(),
  };
};

// delete user