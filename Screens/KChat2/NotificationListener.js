// NotificationListener.js
import React, { useEffect, useState } from 'react';
import { useChatContext } from './ChatContext';
import InstructorResponseModal from './Instructor/InstructorResponseModal';

const NotificationListener = () => {
  const { chatRequest, clearChatRequest } = useChatContext();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (chatRequest) {
      setModalVisible(true);
    } else {
      setModalVisible(false); // Ensure modal is hidden when no chatRequest
    }
  }, [chatRequest]);

  const handleModalClose = () => {
    setModalVisible(false);
    console.log("Modal closed");
    clearChatRequest(); // Clear the request after handling
  };

  return (
    <>
      {modalVisible && chatRequest && (
        <InstructorResponseModal
          chatRequestId={chatRequest.chatRequestId}
          instructorEmail={chatRequest.instructorEmail}
          meditatorEmail={chatRequest.meditatorEmail}
          onClose={handleModalClose} 
        />
      )}
    </>
  );
};

export default NotificationListener;