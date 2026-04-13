"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { io } from 'socket.io-client';
import axios from 'axios';

const CHATBOT_ID = '000000000000000000000001';

export default function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Socket
  useEffect(() => {
    if (user) {
      const s = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001', {
        withCredentials: true
      });

      s.emit('join-room', `user_${user.id}`);

      s.on('new-message', (data: any) => {
        setMessages(prev => {
          // Prevent duplicates if the message was already added via state
          if (prev.find(m => m._id === data.message._id)) return prev;
          return [...prev, data.message];
        });
      });

      setSocket(s);
      return () => { s.disconnect(); };
    }
  }, [user]);

  // Fetch History when opened
  useEffect(() => {
    if (isOpen && user) {
      const fetchHistory = async () => {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/${CHATBOT_ID}`, {
            withCredentials: true
          });
          setMessages(res.data.data.messages);
        } catch (err) {
          console.error("Failed to fetch history", err);
        }
      };
      fetchHistory();
    }
  }, [isOpen, user]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    const content = newMessage;
    setNewMessage('');

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        receiverId: CHATBOT_ID,
        content: content
      }, { withCredentials: true });

      // Add user message to UI immediately
      setMessages(prev => [...prev, res.data.data.message]);
      
      // The AI response will come via Socket.io
    } catch (err) {
      console.error("Chat error", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-10 right-10 z-[200]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-80 h-[450px] bg-white rounded-[2.5rem] shadow-2xl border border-teal-50 overflow-hidden flex flex-col"
          >
            <div className="bg-teal-700 p-6 text-white flex justify-between items-center">
               <div>
                  <h4 className="font-black text-sm tracking-tight text-white m-0">PAWZZ Messenger</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Assistant Online</span>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="text-white hover:opacity-70 transition-opacity">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
               </button>
            </div>

            <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-4 bg-teal-50/20 scroll-smooth">
               {messages.length === 0 && (
                 <div className="text-center py-10 opacity-30 font-black text-[10px] uppercase tracking-widest">No messages yet. <br/> Ask me about pet care!</div>
               )}
               {messages.map((msg, i) => (
                 <div key={i} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-bold shadow-sm ${
                      msg.senderId === user.id ? 'bg-teal-700 text-white rounded-tr-none' : 'bg-white text-teal-950 border border-teal-100 rounded-tl-none'
                    }`}>
                       {msg.content}
                    </div>
                 </div>
               ))}
               {isLoading && (
                 <div className="flex justify-start">
                    <div className="bg-white text-teal-950 border border-teal-100 p-4 rounded-2xl rounded-tl-none text-xs font-bold animate-pulse">
                      Assistant is thinking...
                    </div>
                 </div>
               )}
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
               <input 
                 value={newMessage}
                 onChange={(e) => setNewMessage(e.target.value)}
                 placeholder="Type a message..."
                 disabled={isLoading}
                 className="flex-grow bg-gray-50 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:bg-white focus:ring-1 ring-teal-700/20 transition-all disabled:opacity-50"
               />
               <button 
                 type="submit"
                 disabled={isLoading || !newMessage.trim()}
                 className="w-10 h-10 bg-teal-700 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-teal-800 transition-all disabled:grayscale disabled:opacity-50"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
               </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-teal-700 hover:bg-teal-800 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl relative transition-all active:scale-95 group border-4 border-white"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : '🐾'}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 border-4 border-white rounded-full animate-bounce flex items-center justify-center text-[10px] font-black text-white">1</span>
        )}
        <div className="absolute right-20 bg-teal-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap translate-x-4 group-hover:translate-x-0 shadow-xl">
           Chat with AI Assistant
        </div>
      </button>
    </div>
  );
}
