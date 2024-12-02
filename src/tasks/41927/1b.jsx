import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";

const StudyGroup = ({ group, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [sessions, setSessions] = useState([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, replies: [] }]);
      setMessage("");
    }
  };

  const handleReply = (index, reply) => {
    const updatedMessages = [...messages];
    updatedMessages[index].replies.push(reply);
    setMessages(updatedMessages);
  };

  const handleScheduleSession = () => {
    if (selectedDate) {
      setSessions([...sessions, selectedDate]);
      setSelectedDate(null);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{group.title}</h2>
        <Button onClick={onClose}>Close</Button>
      </div>
      <p className="mb-2"><strong>Theme:</strong> {group.theme}</p>
      <p className="mb-4"><strong>Description:</strong> {group.description}</p>

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
                <Input
                  placeholder="Reply to this message"
                  className="mt-2"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleReply(index, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
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

const CreateGroupForm = ({ onCreateGroup }) => {
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateGroup({ title, theme, description });
    setTitle("");
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
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);

  const handleCreateGroup = (newGroup) => {
    setGroups([...groups, newGroup]);
  };

  const handleViewGroup = (group) => {
    setActiveGroup(group);
  };

  const handleCloseGroup = () => {
    setActiveGroup(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Virtual Study Group Scheduler</h1>
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
      {activeGroup && (
        <div className="mt-6">
          <StudyGroup group={activeGroup} onClose={handleCloseGroup} />
        </div>
      )}
    </div>
  );
}