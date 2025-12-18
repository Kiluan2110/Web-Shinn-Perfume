import { motion } from 'motion/react';
import { MessageSquare, Bug, Keyboard } from 'lucide-react';

export function ChatBotDebugInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-400 rounded-lg p-6 mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <Bug className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
          🔍 Chatbot Debug Info
        </h2>
      </div>

      <div className="space-y-4">
        {/* Current Issue */}
        <div className="bg-yellow-500/10 border border-yellow-400 rounded p-4">
          <h3 className="text-yellow-300 mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Current Issue:
          </h3>
          <p className="text-white/80 text-sm">
            Chat widget xuất hiện nhưng không có input field để gõ text
          </p>
        </div>

        {/* Possible Causes */}
        <div className="bg-red-500/10 border border-red-400 rounded p-4">
          <h3 className="text-red-300 mb-2">❌ Possible Causes:</h3>
          <ul className="text-white/70 text-sm space-y-1 list-disc list-inside">
            <li>n8n workflow is not ACTIVE</li>
            <li>Webhook URL không response</li>
            <li>n8n workflow có lỗi</li>
            <li>CORS not enabled in Respond to Webhook node</li>
            <li>Chat widget config không đúng</li>
          </ul>
        </div>

        {/* Access Test Page */}
        <div className="bg-blue-500/10 border border-blue-400 rounded p-4">
          <h3 className="text-blue-300 mb-2 flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Access Chat Test Page:
          </h3>
          <div className="space-y-2">
            <p className="text-white/80 text-sm">
              Để test webhook trực tiếp, bấm phím tắt:
            </p>
            <div className="flex items-center gap-2 bg-black/50 p-3 rounded">
              <kbd className="px-3 py-1 bg-white/10 border border-white/30 rounded text-sm">Ctrl</kbd>
              <span className="text-white/60">+</span>
              <kbd className="px-3 py-1 bg-white/10 border border-white/30 rounded text-sm">Shift</kbd>
              <span className="text-white/60">+</span>
              <kbd className="px-3 py-1 bg-white/10 border border-white/30 rounded text-sm">C</kbd>
            </div>
            <p className="text-white/60 text-xs mt-2">
              Trang test sẽ cho phép bạn gửi request trực tiếp đến webhook và xem response
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-green-500/10 border border-green-400 rounded p-4">
          <h3 className="text-green-300 mb-2">✅ Next Steps:</h3>
          <ol className="text-white/70 text-sm space-y-1 list-decimal list-inside">
            <li>Press <kbd className="px-2 py-0.5 bg-white/10 border border-white/30 rounded text-xs">Ctrl+Shift+C</kbd> to open Chat Test page</li>
            <li>Test webhook với message "Xin chào"</li>
            <li>Check response - should get AI answer</li>
            <li>If error → check n8n workflow logs</li>
            <li>Make sure n8n workflow is ACTIVE (toggle at top)</li>
          </ol>
        </div>

        {/* Quick Links */}
        <div className="bg-purple-500/10 border border-purple-400 rounded p-4">
          <h3 className="text-purple-300 mb-2">🔗 Quick Links:</h3>
          <div className="space-y-2 text-sm">
            <a 
              href="https://kiluan318.app.n8n.cloud" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-blue-400 hover:text-blue-300 underline"
            >
              → n8n Workflow Editor
            </a>
            <p className="text-white/60 text-xs">
              Webhook: <code className="bg-black/50 px-2 py-1 rounded text-xs">https://kiluan318.app.n8n.cloud/webhook/cb5d47b7-171f-4090-a111-935eb8dd90e2</code>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
