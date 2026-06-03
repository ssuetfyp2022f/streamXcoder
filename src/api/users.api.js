import { collection, getDocs, query, where, doc, updateDoc, deleteDoc, } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useState } from "react";

export const getUsers = async () => {
  const snapshot = await getDocs(
    collection(db, "users")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// get user by email
export const getUserByEmail = async (email) => {
  const q = query(
    collection(db, "users"),
    where("email", "==", email)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) return null;

  const doc = querySnapshot.docs[0];

  const userData = {
    id: doc.id,
    ...doc.data(),
  }
  // console.log(userData.role);
  return userData;
};


// update user
export const updateUserRole = async (
  userId,
  role
) => {
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    role,
  });
};

// delete user
export const deleteUser = async (userId) => {
  await deleteDoc(doc(db, "users", userId));
};
// // get user
// export const getUsers = async () => {
//   const querySnapshot = await getDocs(collection(db, "users"));

//   const usersData = querySnapshot.docs.map((doc) => ({
//     id: doc.id,
//     role: doc.role,
//     ...doc.data(),
//   }));

//   return usersData;
// };


