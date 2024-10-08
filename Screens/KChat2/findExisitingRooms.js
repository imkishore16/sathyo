// import { collection, doc, setDoc, serverTimestamp, query, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
// import { auth, db } from "../../firebase";
// import 'react-native-get-random-values';

// export async function findExisitingRooms() {

//   const meditatorEmail = auth.currentUser?.email;  // Get the current user's email

//   const existingChatRoomQuery = query(
//     collection(db, 'ChatRooms'),
//     where('status', '==', 'created'),
//     // where('')
//     where('meditatorsCount', '<', 2)
//   );

//   const existingChatRoomsSnapshot = await getDocs(existingChatRoomQuery);

//   if (!existingChatRoomsSnapshot.empty) {
//     const chatRoomDoc = existingChatRoomsSnapshot.docs[0];
//     const chatRoomRequestRef = doc(db, 'ChatRooms', chatRoomDoc.id);

//     console.log('Existing chat room found and updated:', chatRoomDoc.id);
//     return chatRoomDoc.id;  
//   }

//   console.log('No existing chat rooms found with status "created".');
//   return null;
// };


import { collection, doc, setDoc, serverTimestamp, query, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from "../../firebase";
import 'react-native-get-random-values';

export async function findExisitingRooms() {
  try {
    const meditatorEmail = auth.currentUser?.email;  

    const existingChatRoomQuery = query(
      collection(db, 'ChatRooms'),
      where('status', '==', 'created'),
      where('meditatorsCount', '<', 2)
    );

    const existingChatRoomsSnapshot = await getDocs(existingChatRoomQuery);

    if (!existingChatRoomsSnapshot.empty) {
      const chatRoomDoc = existingChatRoomsSnapshot.docs[0];
      const chatRoomRequestRef = doc(db, 'ChatRooms', chatRoomDoc.id);

      console.log('Existing chat room found and updated:', chatRoomDoc.id);
      return chatRoomDoc.id;
    }

    console.log('No existing chat rooms found with status "created".');
    return null;

  } catch (error) {
    // console.error('Error accessing ChatRooms collection:', error);
    return null;
  }
}
