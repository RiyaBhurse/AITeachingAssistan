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
      const response = await fetch('http://localhost:3012/chat', {
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '90vh', width: '90vw', margin: '0 auto', padding: '20px', border: '3px solid black' }}>
      <Card style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', overflow: 'hidden' }}>
        <CardHeader style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'grey', borderBottom: '1px solid #ddd', color: 'black', display: 'flex', justifyContent: 'center' }}>
          <CardTitle>AI Teaching Assistant</CardTitle>
        </CardHeader>

        <CardContent style={{ flex: '1 1 auto', overflowY: 'auto', padding: '10px', wordBreak: 'break-word', fontSize: '14px' }}>
          {messages.map((message, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '1rem', 
                textAlign: message.role === 'user' ? 'right' : 'left',
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                width: '100%'
              }}
            >
              <div
                style={{ 
                  display: 'inline-block', 
                  padding: '10px', 
                  borderRadius: '5px', 
                  backgroundColor: message.role === 'user' ? '#bfdbfe' : '#f3f4f6', 
                  color: 'black', 
                  maxWidth: '75%', 
                  wordBreak: 'break-word', 
                  whiteSpace: 'pre-wrap', 
                  overflowWrap: 'break-word',
                  fontSize: '14px', // Reduced font size for better fit
                }}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ddd', backgroundColor: 'white', marginTop: 'auto' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          style={{ flexGrow: 1, marginRight: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '14px' }}
        />
        <button type="submit" disabled={isLoading} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', fontSize: '14px' }}>
          {isLoading ? 'Sending...' : <Send size={20} />}
        </button>
      </form>
    </div>
  );
};

export { AITeachingAssistant };
