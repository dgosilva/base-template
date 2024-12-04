import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const simulateAPICall = (callback, delay = 1000) => {
  setTimeout(callback, delay);
};

const UserStatus = ({ status }) => (
  <span className={`text-xs ${status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
    {status}
  </span>
);

const Message = ({ message, isSender }) => (
  <div className={`mb-2 ${isSender ? 'text-right' : 'text-left'}`}>
    <div className={`inline-block p-2 rounded-lg ${isSender ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
      {message.text}
      <div className="text-xs text-gray-500">{message.time}</div>
    </div>
  </div>
);

function ConversationList({ conversations, onSelect }) {
  return (
    <div className="sm:w-1/3 border-r">
      {conversations.map(conv => (
        <Card key={conv.id} onClick={() => onSelect(conv)} className="cursor-pointer hover:bg-gray-100">
          <CardHeader>
            <CardTitle>{conv.name}</CardTitle>
            <UserStatus status={conv.status} />
          </CardHeader>
          <CardContent>
            <p>{conv.lastMessage}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChatWindow({ conversation, onSendMessage, offline }) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [conversation.messages]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      // Simulate typing indicator for the sender
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1500);
    }
  };

  return (
    <div className="sm:w-2/3 flex flex-col h-full">
      <Card className="flex-grow">
        <CardHeader>
          <CardTitle>{conversation.name}</CardTitle>
          <UserStatus status={conversation.status} />
        </CardHeader>
        <CardContent className="overflow-y-auto flex-grow">
          {conversation.messages.map((msg, idx) => (
            <Message key={idx} message={msg} isSender={msg.isSender} />
          ))}
          {isTyping && <div className="text-left text-gray-500">Typing...</div>}
          <div ref={messagesEndRef} />
        </CardContent>
      </Card>
      <div className="p-4">
        <Input 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="mr-2"
          disabled={offline}
        />
        <Button onClick={handleSend} disabled={offline}>
          {offline ? "Offline" : "Send"}
        </Button>
        {offline && <p className="text-red-500 mt-2">You are offline. Try again when online.</p>}
      </div>
    </div>
  );
}

export default function App() {
  const [conversations, setConversations] = useState([
    { id: 1, name: 'Alice', lastMessage: 'See you soon!', status: 'online', messages: [] },
    { id: 2, name: 'Bob', lastMessage: 'Thanks!', status: 'offline', messages: [] },
  ]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [offline, setOffline] = useState(false);

  const sendMessage = (text) => {
    const newMessage = { text, time: new Date().toLocaleTimeString(), isSender: true };
    // Here would be the place to implement actual API call to send message
    // simulateAPICall(() => {
    //   // Update conversation with new message
    // }, 500);
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: text } : conv
    ));
  };

  const simulateReceiveMessage = () => {
    if (!selectedConversation) return;
    const newMessage = { text: 'Hello from the other side!', time: new Date().toLocaleTimeString(), isSender: false };
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id ? { ...conv, messages: [...conv.messages, newMessage], status: 'typing...' } : conv
    ));
    // Reset status after a while to simulate user stopped typing
    setTimeout(() => setConversations(prev => 
      prev.map(conv => conv.id === selectedConversation.id ? { ...conv, status: 'online' } : conv)
    ), 2000);
  };

  useEffect(() => {
    const interval = setInterval(simulateReceiveMessage, 5000);
    return () => clearInterval(interval);
  }, [selectedConversation]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow flex overflow-hidden">
        <ConversationList conversations={conversations} onSelect={setSelectedConversation} />
        {selectedConversation ? 
          <ChatWindow 
            conversation={selectedConversation} 
            onSendMessage={sendMessage} 
            offline={offline} 
          /> : 
          <div className="sm:w-2/3 flex items-center justify-center text-gray-400">Select a conversation</div>
        }
      </div>
      <Button onClick={() => setOffline(!offline)} className="mb-4 mx-4">
        Toggle Offline Mode
      </Button>
      {/* Here you might want to add a service like Pusher or Firebase for real-time updates */}
    </div>
  );
}