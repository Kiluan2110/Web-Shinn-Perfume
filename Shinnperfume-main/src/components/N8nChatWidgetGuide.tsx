import { motion } from 'motion/react';
import { MessageSquare, Code, Zap, CheckCircle, Copy, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export function N8nChatWidgetGuide() {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const copyCode = (code: string, stepId: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code)
        .then(() => {
          setCopiedStep(stepId);
          setTimeout(() => setCopiedStep(null), 2000);
        })
        .catch(() => fallbackCopy(code, stepId));
    } else {
      fallbackCopy(code, stepId);
    }
  };

  const fallbackCopy = (code: string, stepId: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = code;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      setCopiedStep(stepId);
      setTimeout(() => setCopiedStep(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const CopyButton = ({ code, stepId }: { code: string; stepId: string }) => (
    <button
      onClick={() => copyCode(code, stepId)}
      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white/60 hover:text-white p-2 rounded transition-colors"
      title="Copy to clipboard"
    >
      {copiedStep === stepId ? (
        <CheckCircle className="w-4 h-4 text-green-400" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 text-white"
    >
      {/* Header */}
      <div className="text-center">
        <MessageSquare className="w-20 h-20 text-purple-400 mx-auto mb-4" />
        <h1 className="text-4xl mb-3 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
          n8n Chat Widget Integration
        </h1>
        <p className="text-white/70 text-lg">
          ✅ Website đã tích hợp AI Chatbot với memory storage
        </p>
      </div>

      {/* Current Setup */}
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
          <h2 className="text-2xl tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
            ✅ Current Integration Status
          </h2>
        </div>
        
        <div className="space-y-3">
          <div className="bg-black/30 p-4 rounded">
            <p className="text-green-300 mb-2">✅ ChatBot Component</p>
            <p className="text-white/70 text-sm">Located: <code className="bg-black/50 px-2 py-1 rounded">/components/ChatBot.tsx</code></p>
          </div>
          
          <div className="bg-black/30 p-4 rounded">
            <p className="text-green-300 mb-2">✅ Session Management</p>
            <p className="text-white/70 text-sm">Auto-generates unique sessionId per user stored in sessionStorage</p>
          </div>
          
          <div className="bg-black/30 p-4 rounded">
            <p className="text-green-300 mb-2">✅ Memory API Endpoints</p>
            <p className="text-white/70 text-sm">Backend ready: <code className="bg-black/50 px-2 py-1 rounded">/memory/save</code> và <code className="bg-black/50 px-2 py-1 rounded">/memory/get</code></p>
          </div>
          
          <div className="bg-black/30 p-4 rounded">
            <p className="text-green-300 mb-2">✅ n8n Webhook URL</p>
            <p className="text-white/70 text-sm break-all">
              <code className="bg-black/50 px-2 py-1 rounded text-xs">
                https://kiluan318.app.n8n.cloud/webhook/cb5d47b7-171f-4090-a111-935eb8dd90e2
              </code>
            </p>
          </div>
        </div>
      </div>

      {/* Important: Data Format from n8n Chat Widget */}
      <div className="bg-yellow-500/10 border-2 border-yellow-400 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
            ⚠️ IMPORTANT: n8n Chat Widget Data Format
          </h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-white/80">
            n8n Chat Widget gửi data với format KHÁC so với custom webhook. Bạn CẦN UPDATE workflow nodes:
          </p>
          
          <div className="bg-black/50 p-4 rounded">
            <h3 className="text-yellow-300 mb-3">📥 Data từ n8n Chat Widget:</h3>
            <div className="relative">
              <pre className="text-xs bg-black/70 p-4 rounded overflow-x-auto text-green-300">{`{
  "action": "sendMessage",
  "sessionId": "user_1734471918_abc123",
  "chatInput": "Tôi muốn tìm nước hoa cho nữ"
}`}</pre>
              <CopyButton code={`{
  "action": "sendMessage",
  "sessionId": "user_1734471918_abc123",
  "chatInput": "Tôi muốn tìm nước hoa cho nữ"
}`} stepId="widget-format" />
            </div>
            <p className="text-yellow-300 text-sm mt-2">
              ⚠️ Chú ý: Field là <code className="bg-black/50 px-2 py-1 rounded">chatInput</code> (không phải "message")
            </p>
          </div>
        </div>
      </div>

      {/* Updated Workflow Steps */}
      <div className="bg-black/30 border-2 border-purple-400 rounded-lg p-6">
        <h2 className="text-2xl mb-4 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
          🔄 Update n8n Workflow Nodes
        </h2>
        
        <div className="space-y-6">
          {/* Step 1: Update Prepare Data/Set Node */}
          <div className="bg-purple-500/10 border border-purple-400/50 rounded p-4">
            <h3 className="text-purple-300 mb-3">STEP 1: Update "Set" / "Prepare Data" Node</h3>
            <p className="text-white/70 text-sm mb-3">
              Thay đổi field extraction để match n8n chat widget format:
            </p>
            <div className="relative">
              <pre className="text-xs bg-black/70 p-4 rounded text-green-300">{`// BEFORE (old)
const userMessage = webhookData.message;

// AFTER (new - for n8n chat widget)
const userMessage = webhookData.chatInput || webhookData.body?.chatInput;`}</pre>
              <CopyButton code={`const userMessage = webhookData.chatInput || webhookData.body?.chatInput;`} stepId="update-set" />
            </div>
            
            <div className="mt-3 bg-black/30 p-3 rounded">
              <p className="text-blue-300 text-sm mb-2">Hoặc nếu dùng Set node với Expression:</p>
              <code className="text-green-300 text-xs">{'{{ $json.chatInput || $json.body.chatInput }}'}</code>
            </div>
          </div>

          {/* Step 2: Update Merge Context Code */}
          <div className="bg-orange-500/10 border border-orange-400/50 rounded p-4">
            <h3 className="text-orange-300 mb-3">STEP 2: Update "Merge Context" Code Node</h3>
            <p className="text-white/70 text-sm mb-3">
              FULL CODE đã fix (sử dụng node reference thay vì $node):
            </p>
            <div className="relative">
              <pre className="text-xs bg-black/70 p-4 rounded overflow-x-auto text-green-300">{`const currentData = $input.first().json;

console.log('=== MERGE CONTEXT ===');
console.log('Current message:', currentData.userMessage);
console.log('SessionId:', currentData.sessionId);

// Get previous messages from HTTP Get Memory node
const memoryData = $('HTTP Get Memory').item.json;

console.log('Memory response:', JSON.stringify(memoryData));

let previousMessages = [];

if (memoryData.success && memoryData.data && memoryData.data.messages) {
  previousMessages = memoryData.data.messages;
  console.log('Loaded previous messages:', previousMessages.length);
} else {
  console.log('No previous messages found');
}

// Build context for OpenAI
const contextMessages = [
  ...previousMessages,
  {
    role: 'user',
    content: currentData.userMessage
  }
];

console.log('Total context messages:', contextMessages.length);

return {
  json: {
    userMessage: currentData.userMessage,
    sessionId: currentData.sessionId,
    previousMessages: previousMessages,
    contextMessages: contextMessages
  }
};`}</pre>
              <CopyButton code={`const currentData = $input.first().json;

console.log('=== MERGE CONTEXT ===');
console.log('Current message:', currentData.userMessage);
console.log('SessionId:', currentData.sessionId);

const memoryData = $('HTTP Get Memory').item.json;

console.log('Memory response:', JSON.stringify(memoryData));

let previousMessages = [];

if (memoryData.success && memoryData.data && memoryData.data.messages) {
  previousMessages = memoryData.data.messages;
  console.log('Loaded previous messages:', previousMessages.length);
} else {
  console.log('No previous messages found');
}

const contextMessages = [
  ...previousMessages,
  {
    role: 'user',
    content: currentData.userMessage
  }
];

console.log('Total context messages:', contextMessages.length);

return {
  json: {
    userMessage: currentData.userMessage,
    sessionId: currentData.sessionId,
    previousMessages: previousMessages,
    contextMessages: contextMessages
  }
};`} stepId="merge-code" />
            </div>
          </div>

          {/* Step 3: Update HTTP Get Memory */}
          <div className="bg-blue-500/10 border border-blue-400/50 rounded p-4">
            <h3 className="text-blue-300 mb-3">STEP 3: HTTP Get Memory Config</h3>
            <div className="space-y-3">
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">Method:</p>
                <code className="text-green-300">POST</code>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">URL:</p>
                <div className="relative">
                  <code className="text-blue-300 text-xs block break-all">
                    https://ynhtownozrawefwlxjyf.supabase.co/functions/v1/make-server-335e3812/memory/get
                  </code>
                  <CopyButton code="https://ynhtownozrawefwlxjyf.supabase.co/functions/v1/make-server-335e3812/memory/get" stepId="get-url" />
                </div>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-2">Headers:</p>
                <div className="space-y-2 text-xs">
                  <p><code className="bg-black/50 px-2 py-1 rounded">Content-Type</code>: application/json</p>
                  <p><code className="bg-black/50 px-2 py-1 rounded">Authorization</code>: Bearer eyJhbGci...</p>
                </div>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-2">Body (JSON):</p>
                <div className="relative">
                  <code className="text-green-300 text-xs block">{'{ "sessionId": "={{ $json.sessionId }}" }'}</code>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Update Format HTTP Body */}
          <div className="bg-pink-500/10 border border-pink-400/50 rounded p-4">
            <h3 className="text-pink-300 mb-3">STEP 4: "Format HTTP Body" Code Node</h3>
            <p className="text-white/70 text-sm mb-3">
              Reference sessionId từ Merge Context node:
            </p>
            <div className="relative">
              <pre className="text-xs bg-black/70 p-4 rounded overflow-x-auto text-green-300">{`const aiResponse = $input.first().json;
const mergeData = $('Merge Context').item.json;

const sessionId = mergeData.sessionId;
const userMessage = mergeData.userMessage;

const assistantMessage = aiResponse.output || aiResponse.text || aiResponse.content || String(aiResponse);

return {
  json: {
    sessionId: sessionId,
    messages: [
      {
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
      },
      {
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date().toISOString()
      }
    ]
  }
};`}</pre>
              <CopyButton code={`const aiResponse = $input.first().json;
const mergeData = $('Merge Context').item.json;

const sessionId = mergeData.sessionId;
const userMessage = mergeData.userMessage;

const assistantMessage = aiResponse.output || aiResponse.text || aiResponse.content || String(aiResponse);

return {
  json: {
    sessionId: sessionId,
    messages: [
      {
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
      },
      {
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date().toISOString()
      }
    ]
  }
};`} stepId="format-body" />
            </div>
          </div>

          {/* Step 5: HTTP Save Memory */}
          <div className="bg-green-500/10 border border-green-400/50 rounded p-4">
            <h3 className="text-green-300 mb-3">STEP 5: HTTP Save Memory Config</h3>
            <div className="space-y-3">
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">Method:</p>
                <code className="text-green-300">POST</code>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">URL:</p>
                <div className="relative">
                  <code className="text-blue-300 text-xs block break-all">
                    https://ynhtownozrawefwlxjyf.supabase.co/functions/v1/make-server-335e3812/memory/save
                  </code>
                  <CopyButton code="https://ynhtownozrawefwlxjyf.supabase.co/functions/v1/make-server-335e3812/memory/save" stepId="save-url" />
                </div>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-2">Headers:</p>
                <p className="text-xs"><code className="bg-black/50 px-2 py-1 rounded">Content-Type</code>: application/json</p>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-2">Body - Using Fields Below:</p>
                <div className="space-y-2 text-xs">
                  <p>Parameter 1: <code className="bg-black/50 px-2 py-1 rounded">sessionId</code> = <code className="text-green-300">{'{{ $json.sessionId }}'}</code></p>
                  <p>Parameter 2: <code className="bg-black/50 px-2 py-1 rounded">messages</code> = <code className="text-green-300">{'{{ $json.messages }}'}</code></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testing */}
      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-2 border-cyan-400 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
            🧪 Test Chatbot on Website
          </h2>
        </div>
        
        <div className="space-y-3">
          <div className="bg-black/50 p-4 rounded">
            <h3 className="text-cyan-300 mb-2">1. Mở website SHINN PERFUME</h3>
            <p className="text-white/70 text-sm">Chat widget sẽ xuất hiện ở góc phải màn hình</p>
          </div>
          
          <div className="bg-black/50 p-4 rounded">
            <h3 className="text-cyan-300 mb-2">2. Click vào icon chat</h3>
            <p className="text-white/70 text-sm">Widget sẽ mở với welcome message</p>
          </div>
          
          <div className="bg-black/50 p-4 rounded">
            <h3 className="text-cyan-300 mb-2">3. Gửi tin nhắn test:</h3>
            <code className="text-green-300 text-sm">"Tôi muốn tìm nước hoa cho nữ"</code>
          </div>
          
          <div className="bg-black/50 p-4 rounded">
            <h3 className="text-cyan-300 mb-2">4. Verify memory:</h3>
            <p className="text-white/70 text-sm">Gửi thêm: <code className="text-green-300">"Bạn vừa giới thiệu sản phẩm gì?"</code></p>
            <p className="text-green-300 text-sm mt-2">✅ AI phải nhớ được câu trả lời trước!</p>
          </div>
        </div>
      </div>

      {/* Success */}
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400 rounded-lg p-6 text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h2 className="text-3xl mb-3 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
          🎉 Integration Complete!
        </h2>
        <p className="text-white/80 text-lg mb-4">
          Website SHINN PERFUME đã có AI Chatbot với chat memory!
        </p>
        <div className="inline-block bg-black/30 px-6 py-3 rounded-lg">
          <p className="text-green-300">
            ✨ Users có thể trò chuyện liên tục với AI assistant
          </p>
          <p className="text-green-300">
            💾 Chat history được lưu trong Supabase database
          </p>
          <p className="text-green-300">
            🎯 Mỗi user có session riêng biệt
          </p>
        </div>
      </div>
    </motion.div>
  );
}
