import { motion } from 'motion/react';
import { Webhook, Code, Bot, Save, ArrowRight, CheckCircle, Copy, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export function N8nSetupGuide() {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const copyCode = (code: string, stepId: string) => {
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code)
        .then(() => {
          setCopiedStep(stepId);
          setTimeout(() => setCopiedStep(null), 2000);
        })
        .catch(() => {
          // Fallback to legacy method
          fallbackCopy(code, stepId);
        });
    } else {
      // Fallback to legacy method
      fallbackCopy(code, stepId);
    }
  };

  const fallbackCopy = (code: string, stepId: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = code;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      textArea.remove();
      
      if (successful) {
        setCopiedStep(stepId);
        setTimeout(() => setCopiedStep(null), 2000);
      }
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
        <Bot className="w-20 h-20 text-purple-400 mx-auto mb-4" />
        <h1 className="text-4xl mb-3 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
          n8n AI Chat Setup Guide
        </h1>
        <p className="text-white/70 text-lg">
          Complete step-by-step configuration for SHINN PERFUME chatbot
        </p>
      </div>

      {/* Overview */}
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-2 border-purple-400 rounded-lg p-6">
        <h2 className="text-2xl mb-4 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
          📋 Workflow Overview
        </h2>
        <div className="grid grid-cols-6 gap-2 items-center text-center">
          <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-3">
            <Webhook className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <p className="text-xs">Webhook</p>
          </div>
          <ArrowRight className="w-6 h-6 mx-auto text-white/40" />
          <div className="bg-purple-500/20 border border-purple-400 rounded-lg p-3">
            <Code className="w-6 h-6 mx-auto mb-2 text-purple-400" />
            <p className="text-xs">Get Memory</p>
          </div>
          <ArrowRight className="w-6 h-6 mx-auto text-white/40" />
          <div className="bg-pink-500/20 border border-pink-400 rounded-lg p-3">
            <Bot className="w-6 h-6 mx-auto mb-2 text-pink-400" />
            <p className="text-xs">AI Agent</p>
          </div>
          <ArrowRight className="w-6 h-6 mx-auto text-white/40" />
          <div className="bg-green-500/20 border border-green-400 rounded-lg p-3">
            <Save className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <p className="text-xs">Save Memory</p>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      <div className="bg-yellow-500/10 border-2 border-yellow-400 rounded-lg p-6">
        <h2 className="text-2xl mb-4 tracking-wider flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
          <AlertCircle className="w-6 h-6 text-yellow-400" />
          Prerequisites
        </h2>
        <ul className="space-y-2 text-white/80">
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 mt-1">•</span>
            <span>n8n instance (cloud.n8n.io hoặc self-hosted)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 mt-1">•</span>
            <span>OpenAI API Key (hoặc Claude/Gemini)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 mt-1">•</span>
            <span>Supabase credentials từ Admin Panel → DB INFO</span>
          </li>
        </ul>
      </div>

      {/* Step 1: Webhook */}
      <div className="bg-black/30 border-2 border-blue-400 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center">1</div>
          <h2 className="text-2xl tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
            Webhook Node - Nhận Message từ Website
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-400/50 rounded-lg p-4">
            <h3 className="text-blue-300 mb-3">⚙️ Configuration</h3>
            <div className="space-y-3">
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">HTTP Method:</p>
                <code className="text-green-300">POST</code>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">Path:</p>
                <code className="text-blue-300">chat</code>
                <p className="text-white/50 text-xs mt-2">Full URL sẽ là: https://your-n8n.app.n8n.cloud/webhook/chat</p>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">Response Mode:</p>
                <code className="text-green-300">Using 'Respond to Webhook' Node</code>
              </div>
            </div>
          </div>

          <div className="bg-black/50 border border-white/20 rounded-lg p-4">
            <h3 className="text-white mb-2">📥 Expected Input (từ website):</h3>
            <div className="relative">
              <pre className="text-sm bg-black/70 p-4 rounded overflow-x-auto text-green-300">{`{
  "message": "Tôi muốn tìm nước hoa cho nữ",
  "sessionId": "user_12345"
}`}</pre>
              <CopyButton code={`{
  "message": "Tôi muốn tìm nước hoa cho nữ",
  "sessionId": "user_12345"
}`} stepId="webhook-input" />
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Get Memory */}
      <div className="bg-black/30 border-2 border-purple-400 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center">2</div>
          <h2 className="text-2xl tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
            HTTP Request Node - GET Chat History
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-purple-500/10 border border-purple-400/50 rounded-lg p-4">
            <h3 className="text-purple-300 mb-3">⚙️ Configuration</h3>
            <div className="space-y-3">
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">Method:</p>
                <code className="text-green-300">GET</code>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">URL:</p>
                <div className="relative mt-2">
                  <code className="text-blue-300 text-xs block break-all">
                    https://ynhtownozrawefwlxjyf.supabase.co/functions/v1/make-server-335e3812/memory/{`{{ $json.sessionId }}`}
                  </code>
                  <CopyButton code="https://ynhtownozrawefwlxjyf.supabase.co/functions/v1/make-server-335e3812/memory/{{ $json.sessionId }}" stepId="get-memory-url" />
                </div>
                <p className="text-yellow-300 text-xs mt-2">⚠️ Note: {`{{ $json.sessionId }}`} sẽ tự động lấy từ Webhook</p>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">Authentication:</p>
                <code className="text-green-300">Predefined Credential Type</code>
                <p className="text-white/50 text-xs mt-1">→ Header Auth</p>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">Header Auth Configuration:</p>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-sm">Name:</span>
                    <code className="text-blue-300 bg-black/50 px-2 py-1 rounded">Authorization</code>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-white/60 text-sm">Value:</span>
                    <div className="flex-1 relative">
                      <code className="text-green-300 bg-black/50 px-2 py-1 rounded block break-all text-xs">
                        Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (ANON_KEY từ DB INFO)
                      </code>
                      <p className="text-yellow-300 text-xs mt-1">📌 Lấy ANON_KEY từ Admin Panel → DB INFO</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/50 border border-white/20 rounded-lg p-4">
            <h3 className="text-white mb-2">📤 Expected Output:</h3>
            <div className="relative">
              <pre className="text-sm bg-black/70 p-4 rounded overflow-x-auto text-green-300">{`{
  "success": true,
  "data": {
    "sessionId": "user_12345",
    "messages": [
      {
        "role": "user",
        "content": "Xin chào"
      },
      {
        "role": "assistant",
        "content": "Chào bạn! Tôi có thể giúp gì?"
      }
    ],
    "updatedAt": "2025-12-17T10:30:00Z"
  },
  "messageCount": 2
}`}</pre>
              <CopyButton code={`{
  "success": true,
  "data": {
    "sessionId": "user_12345",
    "messages": [...]
  }
}`} stepId="get-memory-output" />
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Code Node */}
      <div className="bg-black/30 border-2 border-orange-400 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center">3</div>
          <h2 className="text-2xl tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
            Code Node - Format Chat Context
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-orange-500/10 border border-orange-400/50 rounded-lg p-4">
            <h3 className="text-orange-300 mb-3">⚙️ Configuration</h3>
            <div className="space-y-3">
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">Mode:</p>
                <code className="text-green-300">Run Once for All Items</code>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-2">JavaScript Code:</p>
                <div className="relative">
                  <pre className="text-xs bg-black/70 p-4 rounded overflow-x-auto text-green-300">{`// Get data from previous nodes
const webhookData = $input.first().json;
const memoryData = $('HTTP Request').first().json;

// Extract user message and session ID
const userMessage = webhookData.message;
const sessionId = webhookData.sessionId;

// Get previous messages from memory
const previousMessages = memoryData.data?.messages || [];

// Format chat history for AI context
let chatHistory = '';
if (previousMessages.length > 0) {
  chatHistory = previousMessages
    .slice(-10) // Only take last 10 messages
    .map(msg => \`\${msg.role === 'user' ? 'User' : 'Assistant'}: \${msg.content}\`)
    .join('\\n');
}

// Return formatted data for AI Agent
return {
  json: {
    userMessage: userMessage,
    sessionId: sessionId,
    chatHistory: chatHistory,
    previousMessages: previousMessages,
    hasHistory: previousMessages.length > 0
  }
};`}</pre>
                  <CopyButton code={`// Get data from previous nodes
const webhookData = $input.first().json;
const memoryData = $('HTTP Request').first().json;

// Extract user message and session ID
const userMessage = webhookData.message;
const sessionId = webhookData.sessionId;

// Get previous messages from memory
const previousMessages = memoryData.data?.messages || [];

// Format chat history for AI context
let chatHistory = '';
if (previousMessages.length > 0) {
  chatHistory = previousMessages
    .slice(-10) // Only take last 10 messages
    .map(msg => \`\${msg.role === 'user' ? 'User' : 'Assistant'}: \${msg.content}\`)
    .join('\\n');
}

// Return formatted data for AI Agent
return {
  json: {
    userMessage: userMessage,
    sessionId: sessionId,
    chatHistory: chatHistory,
    previousMessages: previousMessages,
    hasHistory: previousMessages.length > 0
  }
};`} stepId="code-format" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4: OpenAI Node */}
      <div className="bg-black/30 border-2 border-pink-400 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center">4</div>
          <h2 className="text-2xl tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
            OpenAI Chat Node - AI Response
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-pink-500/10 border border-pink-400/50 rounded-lg p-4">
            <h3 className="text-pink-300 mb-3">⚙️ Configuration</h3>
            <div className="space-y-3">
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">Resource:</p>
                <code className="text-green-300">Message a Model</code>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">Model:</p>
                <code className="text-green-300">gpt-4o-mini</code>
                <p className="text-white/50 text-xs mt-1">(Hoặc gpt-4, gpt-3.5-turbo tùy nhu cầu)</p>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-2">Messages:</p>
                
                <div className="space-y-3">
                  {/* System Message */}
                  <div className="bg-black/30 p-3 rounded border border-purple-400/30">
                    <p className="text-purple-300 text-xs mb-2">Message 1 - System:</p>
                    <div className="relative">
                      <pre className="text-xs bg-black/70 p-3 rounded text-white/90 whitespace-pre-wrap">{`Bạn là trợ lý AI chuyên nghiệp của SHINN PERFUME - cửa hàng nước hoa cao cấp.

THÔNG TIN SẢN PHẨM:
- For Her: Rose Élégance, Jasmine Dreams, Orchid Mystique
- For Him: Oud Noir, Leather & Tobacco, Ocean Breeze

NHIỆM VỤ:
1. Tư vấn nước hoa phù hợp với sở thích khách hàng
2. Giải đáp thắc mắc về sản phẩm, giá cả, thành phần
3. Hướng dẫn cách sử dụng và bảo quản
4. Gợi ý quà tặng

PHONG CÁCH:
- Chuyên nghiệp, lịch sự, thân thiện
- Trả lời bằng tiếng Việt
- Ngắn gọn, dễ hiểu

${'{{ $json.hasHistory ? "LỊCH SỬ TRÒ CHUYỆN:\\\\n" + $json.chatHistory : "Đây là cuộc trò chuyện đầu tiên." }}'}`}</pre>
                      <CopyButton code={`Bạn là trợ lý AI chuyên nghiệp của SHINN PERFUME - cửa hàng nước hoa cao cấp.

THÔNG TIN SẢN PHẨM:
- For Her: Rose Élégance, Jasmine Dreams, Orchid Mystique
- For Him: Oud Noir, Leather & Tobacco, Ocean Breeze

NHIỆM VỤ:
1. Tư vấn nước hoa phù hợp với sở thích khách hàng
2. Giải đáp thắc mắc về sản phẩm, giá cả, thành phần
3. Hướng dẫn cách sử dụng và bảo quản
4. Gợi ý quà tặng

PHONG CÁCH:
- Chuyên nghiệp, lịch sự, thân thiện
- Trả lời bằng tiếng Việt
- Ngắn gọn, dễ hiểu

${'{{ $json.hasHistory ? "LỊCH SỬ TRÒ CHUYỆN:\\\\n" + $json.chatHistory : "Đây là cuộc trò chuyện đầu tiên." }}'}`} stepId="system-prompt" />
                    </div>
                  </div>

                  {/* User Message */}
                  <div className="bg-black/30 p-3 rounded border border-blue-400/30">
                    <p className="text-blue-300 text-xs mb-2">Message 2 - User:</p>
                    <div className="relative">
                      <code className="text-green-300 bg-black/70 px-3 py-2 rounded block">{'{{ $json.userMessage }}'}</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">Options (Optional):</p>
                <div className="mt-2 space-y-1 text-xs text-white/70">
                  <p>• Temperature: <code className="bg-black/50 px-2 py-1 rounded">0.7</code></p>
                  <p>• Maximum Tokens: <code className="bg-black/50 px-2 py-1 rounded">500</code></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-400 rounded p-3">
            <p className="text-yellow-300 text-sm">
              💡 <strong>Tip:</strong> Cập nhật System prompt với thông tin sản phẩm thực tế từ database của bạn!
            </p>
          </div>
        </div>
      </div>

      {/* Step 5: Save Memory */}
      <div className="bg-black/30 border-2 border-green-400 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center">5</div>
          <h2 className="text-2xl tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
            HTTP Request Node - SAVE Chat Memory
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-400/50 rounded-lg p-4">
            <h3 className="text-green-300 mb-3">⚙️ Configuration</h3>
            <div className="space-y-3">
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">Method:</p>
                <code className="text-green-300">POST</code>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">URL:</p>
                <div className="relative mt-2">
                  <code className="text-blue-300 text-xs block break-all">
                    https://ynhtownozrawefwlxjyf.supabase.co/functions/v1/make-server-335e3812/memory/save
                  </code>
                  <CopyButton code="https://ynhtownozrawefwlxjyf.supabase.co/functions/v1/make-server-335e3812/memory/save" stepId="save-memory-url" />
                </div>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">Authentication:</p>
                <code className="text-green-300">Header Auth (giống Step 2)</code>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">Send Body:</p>
                <code className="text-green-300">Yes</code>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">Body Content Type:</p>
                <code className="text-green-300">JSON</code>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-2">Specify Body:</p>
                <code className="text-green-300">Using JSON</code>
                <div className="relative mt-2">
                  <pre className="text-xs bg-black/70 p-4 rounded overflow-x-auto text-green-300">{`{
  "sessionId": "{{ $('Code').item.json.sessionId }}",
  "messages": [
    {
      "role": "user",
      "content": "{{ $('Code').item.json.userMessage }}"
    },
    {
      "role": "assistant",
      "content": "{{ $('OpenAI').item.json.message.content }}"
    }
  ]
}`}</pre>
                  <CopyButton code={`{
  "sessionId": "{{ $('Code').item.json.sessionId }}",
  "messages": [
    {
      "role": "user",
      "content": "{{ $('Code').item.json.userMessage }}"
    },
    {
      "role": "assistant",
      "content": "{{ $('OpenAI').item.json.message.content }}"
    }
  ]
}`} stepId="save-body" />
                </div>
                <p className="text-yellow-300 text-xs mt-2">
                  ⚠️ Note: Nếu OpenAI node name khác, thay đổi <code className="bg-black/50 px-1 rounded">$('OpenAI')</code> cho phù hợp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 6: Respond to Webhook */}
      <div className="bg-black/30 border-2 border-cyan-400 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-cyan-500 text-white rounded-full w-10 h-10 flex items-center justify-center">6</div>
          <h2 className="text-2xl tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
            Respond to Webhook Node - Trả Response
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-cyan-500/10 border border-cyan-400/50 rounded-lg p-4">
            <h3 className="text-cyan-300 mb-3">⚙️ Configuration</h3>
            <div className="space-y-3">
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">Respond With:</p>
                <code className="text-green-300">Using Fields Below</code>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-1">Response Body:</p>
                <code className="text-green-300">JSON</code>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-sm mb-2">Body:</p>
                <div className="relative">
                  <pre className="text-xs bg-black/70 p-4 rounded overflow-x-auto text-green-300">{`{
  "success": true,
  "message": "{{ $('OpenAI').item.json.message.content }}",
  "sessionId": "{{ $('Code').item.json.sessionId }}"
}`}</pre>
                  <CopyButton code={`{
  "success": true,
  "message": "{{ $('OpenAI').item.json.message.content }}",
  "sessionId": "{{ $('Code').item.json.sessionId }}"
}`} stepId="respond-body" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testing Section */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-400 rounded-lg p-6">
        <h2 className="text-2xl mb-4 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
          🧪 Testing Your Workflow
        </h2>
        
        <div className="space-y-4">
          <div className="bg-black/50 p-4 rounded">
            <h3 className="text-blue-300 mb-2">1. Test trong n8n UI:</h3>
            <p className="text-white/70 text-sm mb-2">Click "Execute Workflow" và gửi test request:</p>
            <div className="relative">
              <pre className="text-xs bg-black/70 p-4 rounded text-green-300">{`curl -X POST https://your-n8n.app.n8n.cloud/webhook/chat \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Tôi muốn tìm nước hoa nữ thanh lịch",
    "sessionId": "test_user_001"
  }'`}</pre>
              <CopyButton code={`curl -X POST https://your-n8n.app.n8n.cloud/webhook/chat \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Tôi muốn tìm nước hoa nữ thanh lịch",
    "sessionId": "test_user_001"
  }'`} stepId="test-curl" />
            </div>
          </div>

          <div className="bg-black/50 p-4 rounded">
            <h3 className="text-blue-300 mb-2">2. Expected Response:</h3>
            <div className="relative">
              <pre className="text-xs bg-black/70 p-4 rounded text-green-300">{`{
  "success": true,
  "message": "Chào bạn! Tôi xin giới thiệu các dòng nước hoa nữ thanh lịch...",
  "sessionId": "test_user_001"
}`}</pre>
              <CopyButton code={`{
  "success": true,
  "message": "Chào bạn! Tôi xin giới thiệu...",
  "sessionId": "test_user_001"
}`} stepId="test-response" />
            </div>
          </div>

          <div className="bg-black/50 p-4 rounded">
            <h3 className="text-blue-300 mb-2">3. Verify Memory:</h3>
            <p className="text-white/70 text-sm mb-2">Gửi request thứ 2 với cùng sessionId để test memory:</p>
            <div className="relative">
              <pre className="text-xs bg-black/70 p-4 rounded text-green-300">{`{
  "message": "Bạn vừa giới thiệu sản phẩm gì?",
  "sessionId": "test_user_001"
}`}</pre>
              <CopyButton code={`{
  "message": "Bạn vừa giới thiệu sản phẩm gì?",
  "sessionId": "test_user_001"
}`} stepId="test-memory" />
            </div>
            <p className="text-green-300 text-xs mt-2">✅ AI nên nhớ được cuộc trò chuyện trước!</p>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="bg-red-500/10 border-2 border-red-400 rounded-lg p-6">
        <h2 className="text-2xl mb-4 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
          🔧 Troubleshooting
        </h2>
        
        <div className="space-y-3">
          <div className="bg-black/50 p-4 rounded">
            <h3 className="text-red-300 mb-2">❌ Error: "Unauthorized"</h3>
            <p className="text-white/70 text-sm">→ Check ANON_KEY trong Header Auth</p>
          </div>

          <div className="bg-black/50 p-4 rounded">
            <h3 className="text-red-300 mb-2">❌ Error: "sessionId is required"</h3>
            <p className="text-white/70 text-sm">→ Webhook không nhận được sessionId từ frontend</p>
          </div>

          <div className="bg-black/50 p-4 rounded">
            <h3 className="text-red-300 mb-2">❌ AI không nhớ conversation</h3>
            <p className="text-white/70 text-sm">→ Check Step 5 (Save Memory) có chạy thành công không</p>
          </div>

          <div className="bg-black/50 p-4 rounded">
            <h3 className="text-red-300 mb-2">❌ OpenAI timeout/error</h3>
            <p className="text-white/70 text-sm">→ Verify OpenAI API key và quota</p>
          </div>
        </div>
      </div>

      {/* Success */}
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400 rounded-lg p-6 text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h2 className="text-3xl mb-3 tracking-wider text-green-300" style={{ fontFamily: 'Cinzel, serif' }}>
          Setup Complete! 🎉
        </h2>
        <p className="text-white/80 text-lg mb-4">
          AI Chatbot của bạn đã sẵn sàng!
        </p>
        <div className="bg-black/40 p-4 rounded-lg inline-block">
          <p className="text-white/90 text-sm mb-2">Webhook URL để integrate vào website:</p>
          <code className="text-green-300 text-xs break-all">
            https://your-n8n.app.n8n.cloud/webhook/chat
          </code>
        </div>
      </div>
    </motion.div>
  );
}