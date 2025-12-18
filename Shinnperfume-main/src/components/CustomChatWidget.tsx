import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function CustomChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => {
    let id = sessionStorage.getItem('shinn_chat_session');
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      sessionStorage.setItem('shinn_chat_session', id);
    }
    return id;
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        text: 'Xin chào! 👋 Tôi là SHINN AI Assistant ✨\n\nTôi có thể giúp bạn:\n🌸 Tư vấn nước hoa phù hợp\n💼 Gợi ý nước hoa nam cao cấp\n👗 Gợi ý nước hoa nữ quyến rũ\n🎁 Tư vấn quà tặng ý nghĩa\n💎 Thông tin chi tiết sản phẩm\n\nBạn đang tìm kiếm mùi hương nào hôm nay? 😊',
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [messages.length]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      console.log('📤 Sending message to n8n:', inputValue);
      
      const response = await fetch('https://kiluan318.app.n8n.cloud/webhook/012d5660-0c40-485f-8add-4f1d5329b9a6/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sendMessage',
          sessionId: sessionId,
          chatInput: inputValue
        })
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Response data:', data);

      // Extract bot response from n8n response
      let botText = '';
      if (data.output) {
        botText = data.output;
      } else if (data.message) {
        botText = data.message;
      } else if (data.text) {
        botText = data.text;
      } else if (typeof data === 'string') {
        botText = data;
      } else {
        botText = 'Xin lỗi, tôi không nhận được phản hồi. Vui lòng thử lại! 🙏';
      }

      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        text: botText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('❌ Error sending message:', error);
      
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        text: 'Xin lỗi, đã có lỗi xảy ra khi kết nối với AI Assistant. Vui lòng thử lại sau! 🙏',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        style={{
          animation: 'pulse-glow 2s infinite',
          border: '2px solid rgba(255, 255, 255, 0.1)'
        }}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 z-50 w-[380px] h-[550px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
          style={{
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            boxShadow: '0 0 40px rgba(147, 51, 234, 0.2), 0 20px 60px rgba(0, 0, 0, 0.6)'
          }}
        >
          {/* Header */}
          <div 
            className="p-5 flex items-center justify-between"
            style={{
              background: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)',
              borderBottom: '1px solid rgba(147, 51, 234, 0.3)'
            }}
          >
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                SHINN AI Assistant
              </h3>
              <p className="text-sm text-white/80 mt-1">
                Chuyên gia tư vấn nước hoa
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(147, 51, 234, 0.5) rgba(255, 255, 255, 0.1)'
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-white/10 border border-white/20 rounded-br-md ml-auto'
                      : 'rounded-bl-md'
                  }`}
                  style={
                    message.sender === 'bot'
                      ? {
                          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(124, 58, 237, 0.15) 100%)',
                          border: '1px solid rgba(147, 51, 234, 0.3)',
                          boxShadow: '0 4px 12px rgba(147, 51, 234, 0.1)'
                        }
                      : {}
                  }
                >
                  <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                <div
                  className="rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(124, 58, 237, 0.15) 100%)',
                    border: '1px solid rgba(147, 51, 234, 0.3)'
                  }}
                >
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                  <span className="text-white/70 text-sm">Đang suy nghĩ...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div 
            className="p-4 border-t"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              borderColor: 'rgba(147, 51, 234, 0.3)'
            }}
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi của bạn..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl text-white text-sm placeholder-white/50 transition-all focus:outline-none focus:ring-2 focus:ring-purple-600/50 disabled:opacity-50"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(147, 51, 234, 0.3)'
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-5 py-3 rounded-xl text-white font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)',
                  boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)'
                }}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyframes for pulse animation */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(147, 51, 234, 0.4), 0 0 0 0 rgba(147, 51, 234, 0.6);
          }
          50% {
            box-shadow: 0 8px 32px rgba(147, 51, 234, 0.6), 0 0 0 8px rgba(147, 51, 234, 0);
          }
        }

        /* Custom scrollbar for chat messages */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.8);
        }
      `}</style>
    </>
  );
}
