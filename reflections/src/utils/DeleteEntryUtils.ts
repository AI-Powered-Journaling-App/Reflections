import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const deleteEntry = async (entryId : string): Promise<void> => {
    const user = auth.currentUser;
    if(!user) throw new Error("no user logged in");

    const entryRef = doc(db, "Entries", user.uid, "User Entries", entryId);
    await deleteDoc(entryRef);
};