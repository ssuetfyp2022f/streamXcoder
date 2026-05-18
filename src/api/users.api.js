import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useState } from "react";


// update user

// get user
export const getUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));

  const usersData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    role: doc.role,
    ...doc.data(),
  }));

  return usersData;
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
  return userData.role;
};

// delete user