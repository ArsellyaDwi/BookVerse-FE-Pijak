import { createContext, useContext, useState } from "react";
import useMutation from "@/hooks/use-mutation";

const ContactContext = createContext({});

export const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error("useContact must be used within ContactProvider");
  }
  return context;
};

export const ContactProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Send contact message
  const { mutate: sendMessage, loading: sendingMessage } = useMutation({
    url: "/contact",
    method: "POST",
    guard: false,
    onSuccess: (data) => {
      console.log("Message sent:", data);
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
    },
  });

  // Get all messages (admin only)
  const { execute: getMessages, loading: gettingMessages } = useMutation({
    url: "/contact/messages",
    method: "GET",
    guard: true,
    onSuccess: (data) => {
      setMessages(data || []);
    },
  });

  // Get single message
  const { execute: getMessage } = useMutation({
    url: "/contact/messages",
    method: "GET",
    guard: true,
    onSuccess: (data) => {
      setSelectedMessage(data);
    },
  });

  // Mark message as read
  const { mutate: markAsRead } = useMutation({
    url: "/contact/messages",
    method: "PATCH",
    guard: true,
    onSuccess: () => {
      getMessages();
    },
  });

  // Delete message
  const { mutate: deleteMessage } = useMutation({
    url: "/contact/messages",
    method: "DELETE",
    guard: true,
    onSuccess: () => {
      getMessages();
    },
  });

  const value = {
    sendMessage,
    sendingMessage,
    getMessages,
    gettingMessages,
    messages,
    getMessage,
    selectedMessage,
    markAsRead,
    deleteMessage,
  };

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  );
};