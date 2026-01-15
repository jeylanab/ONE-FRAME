import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const addItem = (path, data) => addDoc(collection(db, path), data);
export const updateItem = (path, id, data) => updateDoc(doc(db, path, id), data);
export const deleteItem = (path, id) => deleteDoc(doc(db, path, id));
