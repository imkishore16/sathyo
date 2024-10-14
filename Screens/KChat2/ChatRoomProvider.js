import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const ChatRoomContext = createContext();

export const ChatRoomProvider = ({ children }) => {
  const [currentChatRoom, setCurrentChatRoom] = useState(null);

  return (
    <ChatRoomContext.Provider value={{ currentChatRoom, setCurrentChatRoom }}>
      {children}
      <ChatRoomListener />
    </ChatRoomContext.Provider>
  );
};

const ChatRoomListener = () => {
  const navigation = useNavigation();
  const { setCurrentChatRoom } = useContext(ChatRoomContext);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log("User not authenticated, navigating to Login");
        setCurrentChatRoom(null); 
        navigation.navigate("Login");
      } else {
        const q = query(
          collection(db, 'ChatRooms'),
          where('meditatorsEmails', 'array-contains', user.email)
        );

        const unsubscribeChatRooms = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            setCurrentChatRoom(data);
            console.log("Chatroomprovidedr : ",data)
            // navigation.navigate("ChatRoom", { chatRoomId: snapshot.docs[0].id });
            navigation.navigate('CommonChatPage' , {chatRoomId: data.id});
          } else {
            setCurrentChatRoom(null); 
          }
        });

        return () => unsubscribeChatRooms();
      }
    });

    return () => unsubscribeAuth();
  }, [navigation, setCurrentChatRoom]);

  return null;
};

export const useChatRoomContext = () => {
  return useContext(ChatRoomContext);
};
