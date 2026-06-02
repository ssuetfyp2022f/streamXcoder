import { db } from "../firebase/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const PLAYLISTS_COLLECTION = "playlists";

export const getPlaylists = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, PLAYLISTS_COLLECTION));
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching playlists:", error);
        throw error;
    }
};

export const addPlaylist = async (playlistData) => {
    try {
        const docRef = await addDoc(collection(db, PLAYLISTS_COLLECTION), playlistData);
        return { id: docRef.id, ...playlistData };
    } catch (error) {
        console.error("Error adding playlist:", error);
        throw error;
    }
};

export const updatePlaylist = async (id, playlistData) => {
    try {
        const playlistRef = doc(db, PLAYLISTS_COLLECTION, id);
        await updateDoc(playlistRef, playlistData);
        return { id, ...playlistData };
    } catch (error) {
        console.error("Error updating playlist:", error);
        throw error;
    }
};

export const deletePlaylist = async (id) => {
    try {
        const playlistRef = doc(db, PLAYLISTS_COLLECTION, id);
        await deleteDoc(playlistRef);
        return id;
    } catch (error) {
        console.error("Error deleting playlist:", error);
        throw error;
    }
};