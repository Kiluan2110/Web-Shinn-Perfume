import { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle, XCircle, Loader, ArrowLeft } from 'lucide-react';
import { ChatBotDebugInfo } from './ChatBotDebugInfo';
import { N8nQuickFix } from './N8nQuickFix';

export function ChatBotTest() {
  const [message, setMessage] = useState('Xin chào');
  const [sessionId, setSessionId] = useState(`test_${Date.now()}`);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testWebhook = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const webhookUrl = 'https://kiluan318.app.n8n.cloud/webhook/cb5d47b7-171f-4090-a111-935eb8dd90e2';
      
      console.log('Testing webhook:', webhookUrl);
      console.log('Sending data:', { chatInput: message, sessionId });

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sendMessage',
          chatInput: message,
          sessionId: sessionId,
        }),
      });

      console.log('Response status:', res.status);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log('Response data:', data);
      setResponse(data);
    } catch (err: any) {
      console.error('Webhook test error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black text-white p-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span style={{ fontFamily: 'Cinzel, serif' }}>Back to Home</span>
        </button>

        <h1 className="text-4xl mb-8 tracking-wider text-center" style={{ fontFamily: 'Cinzel, serif' }}>
          ChatBot Webhook Test
        </h1>

        {/* Debug Info */}
        <ChatBotDebugInfo />

        <div className="bg-white/5 border border-white/20 rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 tracking-wider">Session ID:</label>
              <input
                type="text"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                className="w-full bg-black/50 border border-white/30 rounded px-4 py-2 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 tracking-wider">Message (chatInput):</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-black/50 border border-white/30 rounded px-4 py-2 focus:outline-none focus:border-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    testWebhook();
                  }
                }}
              />
            </div>

            <button
              onClick={testWebhook}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600/20 border border-green-400 px-6 py-3 rounded-lg hover:bg-green-600/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Test Webhook
                </>
              )}
            </button>
          </div>
        </div>

        {/* Response */}
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/10 border-2 border-green-400 rounded-lg p-6 mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                ✅ Success!
              </h2>
            </div>
            <pre className="text-sm bg-black/50 p-4 rounded overflow-x-auto text-green-300">
              {JSON.stringify(response, null, 2)}
            </pre>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border-2 border-red-400 rounded-lg p-6 mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                  ❌ Error
                </h2>
              </div>
              <p className="text-red-300">{error}</p>
              
              <div className="mt-4 bg-black/50 p-4 rounded">
                <h3 className="text-yellow-300 mb-2">Possible Issues:</h3>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• n8n workflow is not active</li>
                  <li>• Webhook URL is incorrect</li>
                  <li>• CORS not enabled in n8n</li>
                  <li>• n8n workflow has errors</li>
                </ul>
              </div>
            </motion.div>

            {/* Show Quick Fix Guide when error occurs */}
            <N8nQuickFix />
          </>
        )}

        {/* Instructions */}
        <div className="bg-blue-500/10 border border-blue-400 rounded-lg p-6">
          <h2 className="text-xl mb-4 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
            📝 How to use:
          </h2>
          <ol className="space-y-2 text-white/70">
            <li>1. Make sure your n8n workflow is ACTIVE</li>
            <li>2. Enter a test message</li>
            <li>3. Click "Test Webhook"</li>
            <li>4. Check the response - should return AI answer</li>
            <li>5. If error, check n8n workflow logs</li>
          </ol>

          <div className="mt-4 bg-black/50 p-4 rounded">
            <p className="text-yellow-300 text-sm mb-2">Expected Request Format:</p>
            <pre className="text-xs text-green-300">{`{
  "action": "sendMessage",
  "chatInput": "Your message",
  "sessionId": "user_12345"
}`}</pre>
          </div>

          <div className="mt-4 bg-black/50 p-4 rounded">
            <p className="text-yellow-300 text-sm mb-2">Expected Response Format:</p>
            <pre className="text-xs text-green-300">{`{
  "output": "AI response message",
  "sessionId": "user_12345"
}`}</pre>
          </div>
        </div>
      </div>
    </motion.div>
  );
}