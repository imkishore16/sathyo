import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { query, collection, where, onSnapshot, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const ChatRoomContext = createContext();

export const ChatRoomProvider = ({ children }) => {
  const [currentChatRoom, setCurrentChatRoom] = useState(null);

  const checkAgain = async () => {
    const q2 = query(
      collection(db, 'ChatRooms'), // Ensure this is a valid collection path
      where('meditatorsEmails', 'array-contains', auth.currentUser.email)
    );
    const qRef = await getDocs(q2);
    if (!qRef.empty) {
      setCurrentChatRoom(qRef);
    }
  };

  return (
    <ChatRoomContext.Provider value={{ currentChatRoom, setCurrentChatRoom, checkAgain }}>
      {children}
      <ChatRoomListener />
    </ChatRoomContext.Provider>
  );
};

const ChatRoomListener = () => {
  const navigation = useNavigation();
  const { currentChatRoom, setCurrentChatRoom, checkAgain } = useContext(ChatRoomContext);

  useEffect(() => {
    console.log("ChatRoomListener mounted, setting up Firebase listener");

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log("User not authenticated, navigating to Login");
        setCurrentChatRoom(null);
        navigation.navigate("Login");
      } else {
        console.log("User authenticated, setting up chat room listener");

        // const q = query(
        //   collection(db, 'ChatRooms'), // Ensure this is a valid collection path
        //   where('meditatorEmails', 'array-contains', user.email)
        // );

        // const unsubscribeChatRooms = onSnapshot(q, (snapshot) => {
        //   if (!snapshot.empty) {
        //     const chatRoomDoc = snapshot.docs[0]; // Ensure you're referencing a document
        //     const data = chatRoomDoc.data();
        //     setCurrentChatRoom(data);
        //     console.log("Chatroom data:", data);

        //     // Use valid document path to navigate
        //     navigation.navigate('CommonChatPage', { chatRoomId: chatRoomDoc.id });
        //   } else {
        //     setCurrentChatRoom(null);
        //     console.log("checkAgain called due to no chat rooms");
        //     checkAgain();
        //   }
        // });

        // return () => {
        //   console.log("Unsubscribing from chat room listener");
        //   unsubscribeChatRooms();
        // };

        // Query the ChatRooms collection without a where clause
        const q = query(collection(db, 'ChatRooms')); // Getting all chat rooms

        const unsubscribeChatRooms = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            // Filter the chat rooms to find one that contains the user's email
            const chatRoomDoc = snapshot.docs.find(doc => {
              const data = doc.data();
              return data.meditatorEmails && data.meditatorEmails.includes(user.email); // Check if meditatorEmails contains user.email
            });

            if (chatRoomDoc) {
              const data = chatRoomDoc.data();
              setCurrentChatRoom(data);
              console.log("Chatroom data:", data);

              // Navigate to the chat page
              navigation.navigate('CommonChatPage', { chatRoomId: chatRoomDoc.id });
            } else {
              setCurrentChatRoom(null);
              console.log("No chat rooms found for the user.");
              checkAgain(); // Call your function to handle this case
            }
          } else {
            setCurrentChatRoom(null);
            console.log("No chat rooms found.");
            checkAgain(); // Call your function to handle this case
          }
        });

        // Cleanup function
        return () => {
          console.log("Unsubscribing from chat room listener");
          unsubscribeChatRooms();
        };
      }
    });

    return () => {
      console.log("Unsubscribing from auth listener");
      unsubscribeAuth();
    };
  }, [navigation, setCurrentChatRoom]);

  return null;
};

export const useChatRoomContext = () => {
  return useContext(ChatRoomContext);
};
