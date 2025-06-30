
"use client";
import React, { useEffect, useState } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative z-[999]">
      {/* Floating Chat Button */}
      <button 
        onClick={handleToggle}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center font-semibold text-sm ${isOpen ? 'rotate-45' : ''}`}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 h-[500px]"> {/* Fixed height */}
          <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300 flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 text-white p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 cursor-pointer bg-white/20 rounded-full flex items-center justify-center text-sm">
                  🤖
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Assistant</h3>
                  <p className="text-xs opacity-90">Online now</p>
                </div>
              </div>
              <button 
                onClick={handleToggle}
                className="w-6 cursor-pointer h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200 text-sm"
              >
                ✕
              </button>
            </div>
            
            {/* Chat Body - Iframe */}
            <div className="flex-1"> {/* This will take remaining space */}
              <iframe
                src="https://www.chatbase.co/chatbot-iframe/AGP2qrnjDgC1mXq5tNwlP"
                className="w-full h-full border-0"
                allow="microphone"
                title="Chatbase Chatbot"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;