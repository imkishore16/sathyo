import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { query, collection, where, onSnapshot ,getDocs} from 'firebase/firestore';
import { db, auth } from '../../firebase'; 


const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chatRequest, setChatRequest] = useState(null);
  
  const clearChatRequest = async() => {
    setChatRequest(null); 
    console.log(chatRequest)

    const q = query(
      collection(db, 'chatRequests'),
      where('instructorEmail', '==', auth.currentUser.email),
      where('status', '==', 'pending')
    );
    const qRef = await getDocs(q);
    if(!qRef.empty)
    {
      setChatRequest(1); 
    }
  };

  return (
    <ChatContext.Provider value={{ chatRequest, setChatRequest, clearChatRequest }}>
      {children}
      <ChatListener />
    </ChatContext.Provider>
  ); 
}; 

const ChatListener = () => {
  const navigation = useNavigation();
  const { setChatRequest } = useContext(ChatContext);
  
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log("User is not authenticated, navigating to Login");
        setChatRequest(null); 
        navigation.navigate("Login");
      } 
      else {
        console.log("Chat context running")
        const q = query(
          collection(db, 'chatRequests'),
          where('instructorEmail', '==', user.email),
          where('status', '==', 'pending')
        );

        const unsubscribeChatRequests = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            setChatRequest(data);
          } else {
            setChatRequest(null);
          }
        });

        return () => {
          console.log("unsubcribing")
          unsubscribeChatRequests()};
      }
    });

    return () => unsubscribeAuth();
  }, [navigation, setChatRequest]);

  return null; 
};

export const useChatContext = () => {
  return useContext(ChatContext);
};