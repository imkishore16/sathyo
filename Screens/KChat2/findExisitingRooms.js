

import { collection, doc, setDoc, serverTimestamp, query, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from "../../firebase";
import 'react-native-get-random-values';

export async function findExisitingRooms() {
  try {
    console.log("trying to find exsiting rooms")
    // const meditatorEmail = auth.currentUser?.email;  

    const existingChatRoomQuery = query(
      collection(db, 'ChatRooms'),
      where('status', '==', 'created'),
      where('meditatorsCount', '<', 2)
    );
    console.log(1)

    const existingChatRoomsSnapshot = await getDocs(existingChatRoomQuery);
    console.log(2)

    if (!existingChatRoomsSnapshot.empty) {
      const chatRoomDoc = existingChatRoomsSnapshot.docs[0];
      const chatRoomRequestRef = doc(db, 'ChatRooms', chatRoomDoc.id);

      console.log('Existing chat room found and updated:', chatRoomDoc.id);
      return chatRoomDoc.id;
    }

    console.log('No existing chat rooms found with status "created".');
    return null;

  } catch (error) {
    console.error('Error accessing ChatRooms collection:', error);
    return null;
  }
}
