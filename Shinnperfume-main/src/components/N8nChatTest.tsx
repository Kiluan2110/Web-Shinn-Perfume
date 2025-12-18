import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bot, Copy, Check, ExternalLink } from 'lucide-react';

export function N8nChatTest() {
  const [chatUrl, setChatUrl] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Example URL để hướng dẫn
  const exampleUrl = 'https://shinnperfume.app.n8n.cloud/chat/YOUR_WEBHOOK_ID';

  useEffect(() => {
    if (chatUrl && chatUrl.includes('n8n.cloud/chat/')) {
      // Load n8n chat script
      const script = document.createElement('script');
      script.type = 'module';
      script.innerHTML = `
        import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
        
        createChat({
          webhookUrl: '${chatUrl}',
          mode: 'window',
          chatInputKey: 'chatInput',
          chatSessionKey: 'sessionId',
          metadata: {},
          showWelcomeScreen: false,
          defaultLanguage: 'vi',
          initialMessages: [
            'Xin chào! 👋 Tôi là trợ lý AI của SHINN PERFUME ✨',
            '',
            'Tôi có thể giúp bạn:',
            '🌸 Tìm nước hoa phù hợp',
            '💎 Tư vấn mùi hương', 
            '🎁 Gợi ý quà tặng',
            '',
            'Bạn đang tìm kiếm gì hôm nay?'
          ],
          i18n: {
            vi: {
              title: 'SHINN AI Assistant',
              subtitle: 'Trợ lý nước hoa thông minh',
              footer: '',
              getStarted: 'Bắt đầu trò chuyện',
              inputPlaceholder: 'Nhập tin nhắn...',
            },
          },
        });
      `;
      document.body.appendChild(script);
      setIsLoaded(true);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [chatUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(exampleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Bot className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl">N8N Chat Test - SHINN PERFUME</h1>
          </div>
          <p className="text-gray-400">
            Nhập Chat URL từ n8n để test chatbot
          </p>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800"
        >
          <h2 className="text-xl mb-4 flex items-center gap-2">
            📋 Hướng dẫn lấy Chat URL
          </h2>
          
          <div className="space-y-3 text-gray-300">
            <div className="flex gap-3">
              <span className="text-purple-400 font-bold">1.</span>
              <span>Mở n8n workflow <strong>"SHINN Perfume Chat"</strong></span>
            </div>
            
            <div className="flex gap-3">
              <span className="text-purple-400 font-bold">2.</span>
              <span>Click vào node <strong>"When chat message received"</strong></span>
            </div>
            
            <div className="flex gap-3">
              <span className="text-purple-400 font-bold">3.</span>
              <span>Copy <strong>"Chat URL"</strong> (dạng: https://shinnperfume.app.n8n.cloud/chat/...)</span>
            </div>
            
            <div className="flex gap-3">
              <span className="text-purple-400 font-bold">4.</span>
              <span>Paste vào ô bên dưới và click <strong>"Load Chat"</strong></span>
            </div>
          </div>

          {/* Example URL */}
          <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Example URL:</span>
              <button
                onClick={handleCopy}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <code className="text-xs text-green-400 break-all">
              {exampleUrl}
            </code>
          </div>
        </motion.div>

        {/* Chat URL Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 rounded-lg p-6 border border-gray-800"
        >
          <label className="block mb-3 text-lg">
            🔗 N8N Chat URL:
          </label>
          
          <div className="flex gap-3">
            <input
              type="text"
              value={chatUrl}
              onChange={(e) => setChatUrl(e.target.value)}
              placeholder="https://shinnperfume.app.n8n.cloud/chat/..."
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            
            <button
              onClick={() => setIsLoaded(false)}
              disabled={!chatUrl || !chatUrl.includes('n8n.cloud/chat/')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Load Chat
            </button>
          </div>

          {chatUrl && !chatUrl.includes('n8n.cloud/chat/') && (
            <p className="mt-2 text-sm text-red-400">
              ⚠️ URL không hợp lệ. Phải có dạng: https://....n8n.cloud/chat/...
            </p>
          )}

          {isLoaded && (
            <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded text-green-400 text-sm">
              ✅ Chat loaded! Widget sẽ xuất hiện ở góc dưới phải màn hình.
            </div>
          )}
        </motion.div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-gray-500 text-sm"
        >
          {isLoaded ? (
            <p className="text-green-400">
              🤖 Chatbot đang hoạt động. Check góc dưới phải! →
            </p>
          ) : (
            <p>
              Chờ bạn paste Chat URL từ n8n workflow...
            </p>
          )}
        </motion.div>

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.location.reload();
            }}
            className="text-purple-400 hover:text-purple-300 underline"
          >
            ← Quay về trang chủ
          </a>
        </motion.div>
      </div>
    </div>
  );
}
