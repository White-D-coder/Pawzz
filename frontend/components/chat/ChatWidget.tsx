"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { io } from 'socket.io-client';
import axios from 'axios';

export default function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const s = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001', {
        withCredentials: true
      });

      s.emit('join-room', `user_${user.id}`);

      s.on('new-message', (data: any) => {
        setMessages(prev => [...prev, data.message]);
        // Notification sound or alert could go here
      });

      setSocket(s);
      return () => { s.disconnect(); };
    }
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // For Demo: we send to a default 'system' or another user
      // in production, you'd select a contact
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        receiverId: "661234567890123456789012", // Mock Receiver ID
        content: newMessage
      }, { withCredentials: true });

      setMessages(prev => [...prev, res.data.data.message]);
      setNewMessage('');
    } catch (err) {
      console.error("Chat error", err);
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
                  <h4 className="font-black text-sm tracking-tight">PAWZZ Messenger</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Tribe Online</span>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="text-xl">✕</button>
            </div>

            <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-4 bg-teal-50/20">
               {messages.length === 0 && (
                 <div className="text-center py-10 opacity-30 font-black text-[10px] uppercase tracking-widest">No messages yet. <br/> Start the conversation!</div>
               )}
               {messages.map((msg, i) => (
                 <div key={i} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-bold ${
                      msg.senderId === user.id ? 'bg-teal-700 text-white rounded-tr-none' : 'bg-white text-teal-950 border border-teal-100 rounded-tl-none'
                    }`}>
                       {msg.content}
                    </div>
                 </div>
               ))}
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
               <input 
                 value={newMessage}
                 onChange={(e) => setNewMessage(e.target.value)}
                 placeholder="Type a message..."
                 className="flex-grow bg-gray-50 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:bg-white focus:ring-1 ring-teal-700/20 transition-all"
               />
               <button className="w-10 h-10 bg-teal-700 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-teal-800 transition-all">
                  ➤
               </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-teal-700 hover:bg-teal-800 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl relative transition-all active:scale-90 group"
      >
        {isOpen ? '✕' : '💬'}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 border-2 border-white rounded-full animate-bounce" />
        )}
        <div className="absolute right-20 bg-black/80 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
           Chat with Tribe
        </div>
      </button>
    </div>
  );
}
