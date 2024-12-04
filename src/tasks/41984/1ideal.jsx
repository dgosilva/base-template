import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Simulated API calls
const api = {
  fetchChats: () => Promise.resolve(mockChats),
  sendMessage: (chatId, message) => new Promise((resolve) => {
    setTimeout(() => resolve({ id: Date.now(), text: message, sent: true }), 500);
  }),
  updateStatus: (userId, status) => Promise.resolve({ userId, status }),
};

// Mock data
const mockChats = [
  {
    id: 1,
    user: { id: 1, name: "Alice", avatar: "A", status: "online" },
    messages: [
      { id: 1, text: "Hey there!", sent: false },
      { id: 2, text: "Hi Alice! How are you?", sent: true },
    ],
  },
  {
    id: 2,
    user: { id: 2, name: "Bob", avatar: "B", status: "offline" },
    messages: [
      { id: 1, text: "Did you see the game last night?", sent: false },
      { id: 2, text: "No, I missed it. How was it?", sent: true },
    ],
  },
];

export default function App() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    api.fetchChats().then(setChats);
  }, []);

  const handleSendMessage = (retryMessageId = null) => {
    if (!message.trim() && retryMessageId === null) return;
  
    const msgId = retryMessageId || Date.now();
    const msgText = retryMessageId ? selectedChat.messages.find(msg => msg.id === retryMessageId).text : message;
  
    const newMessage = {
      id: msgId,
      text: msgText,
      sent: true,
      pending: true,
    };
  
    setSelectedChat((prev) => ({
      ...prev,
      messages: retryMessageId
        ? prev.messages.map((m) => (m.id === msgId ? newMessage : m))
        : [...prev.messages, newMessage],
    }));
  
    if (!retryMessageId) {
      setMessage("");
    }
  
    if (!isOnline) {
      // Mark the message with an error if offline
      setTimeout(() => {
        setSelectedChat((prev) => ({
          ...prev,
          messages: prev.messages.map((m) =>
            m.id === msgId ? { ...m, error: true, pending: false } : m
          ),
        }));
      }, 1000);
      return;
    }
  
    // Simulate sending the message
    api.sendMessage(selectedChat.id, msgText).then((sentMessage) => {
      setSelectedChat((prev) => ({
        ...prev,
        messages: prev.messages.map((m) =>
          m.id === msgId ? { ...sentMessage, pending: false } : m
        ),
      }));
      // Simulate receiving a message
      setTimeout(() => {
        const receivedMessage = {
          id: Date.now(),
          text: "Thanks for your message!",
          sent: false,
        };
        setSelectedChat((prev) => ({
          ...prev,
          messages: [...prev.messages, receivedMessage],
        }));
      }, 1000);
    }).catch(() => {
      setSelectedChat((prev) => ({
        ...prev,
        messages: prev.messages.map((m) =>
          m.id === msgId ? { ...m, error: true, pending: false } : m
        ),
      }));
    });
  };
  
  const handleRetry = (messageId) => {
    handleSendMessage(messageId);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 bg-white border-r">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">Chats</h1>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="p-4 border-b cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedChat(chat)}
            >
              <div className="flex items-center">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${chat.user.name}`} />
                  <AvatarFallback>{chat.user.avatar}</AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <h2 className="font-semibold">{chat.user.name}</h2>
                  <p className="text-sm text-gray-500">
                    {chat.messages[chat.messages.length - 1].text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <Card className="flex-1 flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedChat.user.name}`} />
                    <AvatarFallback>{selectedChat.user.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h2 className="font-semibold">{selectedChat.user.name}</h2>
                    <p className="text-sm text-gray-500">{selectedChat.user.status}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.sent
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.text}
                      {msg.error && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRetry(msg.id)}
                          className="ml-2 text-red-500"
                        >
                          Retry
                        </Button>
                      )}
                      {msg.pending && <span className="ml-2 text-gray-300">...</span>}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-800 p-3 rounded-lg">
                      Typing...
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="p-4 bg-white border-t flex items-center">
              <Input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 mr-4"
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
      <div className="fixed bottom-4 right-4">
        <Button
          onClick={() => setIsOnline(!isOnline)}
          className={isOnline ? "bg-green-500" : "bg-red-500"}
        >
          {isOnline ? "Online" : "Offline"}
        </Button>
      </div>
    </div>
  );
}

// Comments for future improvements:
// 1. Implement persistence using a backend database or local storage
// 2. Use WebSockets or a real-time database for live updates
// 3. Implement user authentication and authorization
// 4. Add file upload and sharing functionality
// 5. Implement end-to-end encryption for secure messaging
// 6. Add voice and video call features
// 7. Implement message search functionality
// 8. Add support for group chats and channels
// 9. Implement push notifications for new messages
// 10. Add message reactions and threaded replies

// Suggested libraries for a real-world implementation:
// 1. Socket.io for real-time communication
// 2. Firebase or Supabase for backend and real-time database
// 3. Redux or Zustand for state management
// 4. React Query for data fetching and caching
// 5. Formik or React Hook Form for form handling
// 6. Yup for form validation
// 7. Day.js or date-fns for date manipulation
// 8. React Native for mobile app development
// 9. NextAuth.js for authentication in Next.js applications
// 10. TanStack Virtual for efficient rendering of large lists