import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

// create video
export const addVideos = async (videoData) => {
    try {
        const docRef = await addDoc(collection(db, "videos"), videoData);

        return {
            success: true,
            id: docRef.id,
        };
    } catch (error) {
        console.log("Error adding video:", error);

        return {
            success: false,
            error: error.message,
        };
    }
};


// retrieve video
export const getVideos = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "videos"));

        const videosData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return videosData;
    } catch (error) {
        console.log("Error fetching videos:", error);
        return [];
    }
};

// update video
export const updateVideos = async (id, updatedData) => {
    try {
        const videoRef = doc(db, "videos", id);

        await updateDoc(videoRef, updatedData);

        return {
            success: true,
        };
    } catch (error) {
        console.log("Error updating video:", error);

        return {
            success: false,
            error: error.message,
        };
    }
};

// delete video
export const deleteVideos = async (id) => {
    try {
        const videoRef = doc(db, "videos", id);

        await deleteDoc(videoRef);

        return {
            success: true,
        };
    } catch (error) {
        console.log("Error deleting video:", error);

        return {
            success: false,
            error: error.message,
        };
    }
};