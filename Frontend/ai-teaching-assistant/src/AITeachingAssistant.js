import React, { useState, useEffect, useRef } from 'react';
import Send from './Send';
import { Button } from './Button';
import { Input } from './Input';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import ReactMarkdown from 'react-markdown';

const AITeachingAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');

    try {
      const response = await fetch('http://localhost:3011/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <Card className="flex-grow overflow-hidden flex flex-col">
        <CardHeader>
          <CardTitle>AI Teaching Assistant</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
      </Card>
      <form onSubmit={handleSubmit} className="mt-4 flex">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          className="flex-grow mr-2"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : <Send size={20} />}
        </Button>
      </form>
    </div>
  );
};

export { AITeachingAssistant };