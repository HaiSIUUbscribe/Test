import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * Thêm tài liệu mới vào một collection trong Firestore.
 * @param {string} collectionName - Tên collection.
 * @param {Object} data - Dữ liệu cần thêm.
 * @returns {Promise<string>} - ID của tài liệu mới.
 */
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

/**
 * Lấy tất cả tài liệu từ một collection trong Firestore.
 * @param {string} collectionName - Tên collection.
 * @returns {Promise<Array>} - Danh sách tài liệu.
 */
export const getDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
};

/**
 * Cập nhật tài liệu trong Firestore.
 * @param {string} collectionName - Tên collection.
 * @param {string} docId - ID của tài liệu cần cập nhật.
 * @param {Object} data - Dữ liệu cần cập nhật.
 * @returns {Promise<void>}
 */
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    console.log("Document updated with ID: ", docId);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

/**
 * Xóa tài liệu trong Firestore.
 * @param {string} collectionName - Tên collection.
 * @param {string} docId - ID của tài liệu cần xóa.
 * @returns {Promise<void>}
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log("Document deleted with ID: ", docId);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};