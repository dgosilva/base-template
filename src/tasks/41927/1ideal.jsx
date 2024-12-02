import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";

// Component to display a study group with its details and functionalities
const StudyGroup = ({ group, onClose }) => {
  const [message, setMessage] = useState(""); // State for new message input
  const [messages, setMessages] = useState([]); // State to store messages
  const [selectedDate, setSelectedDate] = useState(null); // State for selected calendar date
  const [sessions, setSessions] = useState([]); // State to store scheduled sessions

  // Function to handle sending a new message
  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, replies: [] }]);
      setMessage(""); // Clear message input after sending
    }
  };

  // Function to handle replying to a message
  const handleReply = (index, reply) => {
    const updatedMessages = [...messages];
    updatedMessages[index].replies.push(reply);
    setMessages(updatedMessages);
  };

  // Function to handle scheduling a study session
  const handleScheduleSession = () => {
    if (selectedDate) {
      setSessions([...sessions, selectedDate]);
      setSelectedDate(null); // Clear selected date after scheduling
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      {/* Group header with title and close button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{group.title}</h2>
        <Button onClick={onClose}>Close</Button>
      </div>
      {/* Group theme and description */}
      <p className="mb-2"><strong>Theme:</strong> {group.theme}</p>
      <p className="mb-4"><strong>Description:</strong> {group.description}</p>

      {/* Section to schedule study sessions */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Schedule Study Session</h3>
        <div className="flex gap-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
          <Button onClick={handleScheduleSession}>Schedule Session</Button>
        </div>
      </div>

      {/* Timeline displaying scheduled sessions */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Timeline</h3>
        {sessions.length > 0 ? (
          <ul className="list-disc pl-5">
            {sessions.map((session, index) => (
              <li key={index}>{session.toDateString()}</li>
            ))}
          </ul>
        ) : (
          <p>No sessions scheduled yet.</p>
        )}
      </div>

      {/* Message board for group communication */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Message Board</h3>
        <div className="space-y-2">
          {messages.map((msg, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <p>{msg.text}</p>
                {msg.replies.map((reply, replyIndex) => (
                  <p key={replyIndex} className="ml-4 mt-2 text-sm text-gray-600">
                    ↳ {reply}
                  </p>
                ))}
                {/* Input for replying to messages */}
                <Input
                  placeholder="Reply to this message"
                  className="mt-2"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleReply(index, e.target.value);
                      e.target.value = ""; // Clear reply input after sending
                    }
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Input for sending new messages */}
        <div className="flex gap-2 mt-4">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};

// Component for creating a new study group
const CreateGroupForm = ({ onCreateGroup }) => {
  const [title, setTitle] = useState(""); // State for group title
  const [theme, setTheme] = useState(""); // State for group theme
  const [description, setDescription] = useState(""); // State for group description

  // Handle form submission to create a group
  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateGroup({ title, theme, description }); // Pass new group data to parent
    setTitle(""); // Clear form inputs after submission
    setTheme("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Group Title"
        required
      />
      <Input
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        placeholder="Group Theme"
        required
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Group Description"
        required
      />
      <Button type="submit">Create Group</Button>
    </form>
  );
};

export default function App() {
  const [groups, setGroups] = useState([]); // State for storing groups
  const [activeGroup, setActiveGroup] = useState(null); // State for currently active group

  // Function to add a new group to the list
  const handleCreateGroup = (newGroup) => {
    setGroups([...groups, newGroup]);
  };

  // Function to view group details
  const handleViewGroup = (group) => {
    setActiveGroup(group);
  };

  // Function to close the active group view
  const handleCloseGroup = () => {
    setActiveGroup(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Virtual Study Group Scheduler</h1>
      {/* Tabs for switching between group list and group creation */}
      <Tabs defaultValue="groups">
        <TabsList className="mb-4">
          <TabsTrigger value="groups">My Groups</TabsTrigger>
          <TabsTrigger value="create">Create Group</TabsTrigger>
        </TabsList>
        <TabsContent value="groups">
          {groups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {groups.map((group, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{group.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Theme:</strong> {group.theme}</p>
                    <Button
                      onClick={() => handleViewGroup(group)}
                      className="mt-2"
                    >
                      View Group
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>You haven't joined any groups yet.</p>
          )}
        </TabsContent>
        <TabsContent value="create">
          <CreateGroupForm onCreateGroup={handleCreateGroup} />
        </TabsContent>
      </Tabs>
      {/* Display the active group if one is selected */}
      {activeGroup && (
        <div className="mt-6">
          <StudyGroup group={activeGroup} onClose={handleCloseGroup} />
        </div>
      )}
    </div>
  );
}