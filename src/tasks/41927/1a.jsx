import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';

function App() {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [newGroup, setNewGroup] = useState({ title: '', theme: '', description: '' });

  const handleCreateGroup = () => {
    setGroups([...groups, { ...newGroup, id: Date.now(), sessions: [], messages: [] }]);
    setNewGroup({ title: '', theme: '', description: '' });
  };

  const handleScheduleSession = (date) => {
    if (currentGroup) {
      const updatedGroup = { ...currentGroup, sessions: [...currentGroup.sessions, date] };
      setGroups(groups.map(g => g.id === currentGroup.id ? updatedGroup : g));
      setCurrentGroup(updatedGroup);
    }
  };

  const handleSendMessage = (text) => {
    if (currentGroup) {
      const message = { text, timestamp: new Date(), replies: [] };
      const updatedMessages = [...currentGroup.messages, message];
      const updatedGroup = { ...currentGroup, messages: updatedMessages };
      setGroups(groups.map(g => g.id === currentGroup.id ? updatedGroup : g));
      setCurrentGroup(updatedGroup);
    }
  };

  const handleReply = (index, replyText) => {
    const updatedMessages = currentGroup.messages.map((msg, idx) => 
      idx === index ? {...msg, replies: [...msg.replies, { text: replyText, timestamp: new Date() }]} : msg
    );
    const updatedGroup = { ...currentGroup, messages: updatedMessages };
    setGroups(groups.map(g => g.id === currentGroup.id ? updatedGroup : g));
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Virtual Study Group Scheduler</h1>
      <Tabs defaultValue="groups">
        <TabsList>
          <TabsTrigger value="groups">My Groups</TabsTrigger>
          <TabsTrigger value="create">Create Group</TabsTrigger>
        </TabsList>
        <TabsContent value="groups">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {groups.map(group => (
              <Card key={group.id} className="cursor-pointer" onClick={() => setCurrentGroup(group)}>
                <CardHeader>
                  <CardTitle>{group.title}</CardTitle>
                  <CardDescription>{group.theme}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{group.description}</p>
                </CardContent>
                <Button>View Group</Button>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="create">
          <Input 
            value={newGroup.title} 
            onChange={e => setNewGroup({...newGroup, title: e.target.value})} 
            placeholder="Group Title" 
            className="mb-2"
          />
          <Input 
            value={newGroup.theme} 
            onChange={e => setNewGroup({...newGroup, theme: e.target.value})} 
            placeholder="Theme" 
            className="mb-2"
          />
          <Textarea 
            value={newGroup.description} 
            onChange={e => setNewGroup({...newGroup, description: e.target.value})} 
            placeholder="Description" 
            className="mb-2"
          />
          <Button onClick={handleCreateGroup}>Create Group</Button>
        </TabsContent>
      </Tabs>

      {currentGroup && (
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{currentGroup.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar mode="single" onSelect={handleScheduleSession} />
              <h2 className="text-lg mt-4 mb-2">Timeline</h2>
              {currentGroup.sessions.map((session, idx) => (
                <div key={idx} className="mb-2">{format(session, 'PPpp')}</div>
              ))}
              <h2 className="text-lg mt-4 mb-2">Messages</h2>
              {currentGroup.messages.map((msg, idx) => (
                <div key={idx} className="border-b pb-2 mb-2">
                  <p>{msg.text} <small>{format(msg.timestamp, 'PPpp')}</small></p>
                  {msg.replies.map((reply, rIdx) => (
                    <div key={rIdx} className="ml-4">
                      <small>Reply: {reply.text} - {format(reply.timestamp, 'PPpp')}</small>
                    </div>
                  ))}
                  <Input 
                    placeholder="Reply to this message" 
                    onKeyDown={(e) => e.key === 'Enter' && handleReply(idx, e.target.value)} 
                  />
                </div>
              ))}
              <Input 
                placeholder="Send a message..." 
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e.target.value)} 
                className="mt-2"
              />
            </CardContent>
            <Button onClick={() => setCurrentGroup(null)} className="mt-2">Close</Button>
          </Card>
        </div>
      )}
    </div>
  );
}

export default App;