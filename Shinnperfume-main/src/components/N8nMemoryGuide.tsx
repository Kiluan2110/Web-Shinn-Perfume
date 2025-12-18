import { motion } from 'motion/react';
import { Brain, Workflow, Database, ArrowRight } from 'lucide-react';

export function N8nMemoryGuide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h1 className="text-3xl text-white tracking-wider mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
          n8n AI Agent Memory Setup Guide
        </h1>
        <p className="text-white/60">
          Complete workflow setup for AI chatbot with persistent memory using Supabase
        </p>
      </div>

      {/* Problem Statement */}
      <div className="bg-red-500/10 border-2 border-red-400 rounded-lg p-5">
        <h2 className="text-red-300 text-xl mb-3 tracking-wider flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
          ⚠️ The Problem
        </h2>
        <p className="text-white/80 mb-2">
          PostgreSQL direct connection failed with error: <code className="bg-black/50 px-2 py-1 rounded text-red-300">ENETUNREACH</code>
        </p>
        <p className="text-white/60 text-sm">
          Your n8n instance cannot reach Supabase's PostgreSQL server due to network/IPv6 issues.
        </p>
      </div>

      {/* Solution */}
      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-2 border-green-400 rounded-lg p-5">
        <h2 className="text-green-300 text-xl mb-3 tracking-wider flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
          ✅ The Solution
        </h2>
        <p className="text-white/80 mb-4">
          Use <strong className="text-green-300">HTTP Request nodes</strong> to call our custom Memory API endpoints instead of PostgreSQL connection.
        </p>
        <div className="bg-black/40 p-4 rounded-lg">
          <p className="text-white/90 text-sm">
            We created a REST API wrapper around Supabase that works everywhere - no network issues!
          </p>
        </div>
      </div>

      {/* Workflow Architecture */}
      <div className="bg-black/30 border border-white/20 rounded-lg p-5">
        <h2 className="text-white text-xl mb-4 tracking-wider flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
          <Workflow className="w-6 h-6" />
          n8n Workflow Architecture
        </h2>
        
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-l-4 border-blue-400 p-4 rounded">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</div>
              <h3 className="text-blue-300 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>Webhook / Chat Trigger</h3>
            </div>
            <p className="text-white/70 text-sm ml-11">
              Receives user message from website chatbot
            </p>
            <code className="block text-xs bg-black/50 p-2 rounded mt-2 ml-11">
              {`Input: { "message": "Hello", "sessionId": "user123" }`}
            </code>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="text-white/40" />
          </div>

          {/* Step 2 */}
          <div className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-l-4 border-purple-400 p-4 rounded">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</div>
              <h3 className="text-purple-300 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>HTTP Request - GET Memory</h3>
            </div>
            <p className="text-white/70 text-sm ml-11 mb-2">
              Fetch chat history for this session
            </p>
            <div className="ml-11 space-y-2">
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-xs mb-1">Method:</p>
                <code className="text-green-300 text-xs">GET</code>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-xs mb-1">URL:</p>
                <code className="text-blue-300 text-xs break-all">
                  {`https://ynhtownozrawefwlxjyf.supabase.co/functions/v1/make-server-335e3812/memory/{{$json.sessionId}}`}
                </code>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-xs mb-1">Headers:</p>
                <code className="text-xs text-white/80">Authorization: Bearer [ANON_KEY]</code>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="text-white/40" />
          </div>

          {/* Step 3 */}
          <div className="bg-gradient-to-r from-pink-500/10 to-pink-500/5 border-l-4 border-pink-400 p-4 rounded">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</div>
              <h3 className="text-pink-300 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>Code Node - Format Context</h3>
            </div>
            <p className="text-white/70 text-sm ml-11 mb-2">
              Prepare chat history for AI Agent
            </p>
            <div className="ml-11">
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-xs mb-2">JavaScript Code:</p>
                <pre className="text-xs text-white/80 overflow-x-auto">{`const memory = $input.item.json.data;
const userMessage = $('Webhook').item.json.message;

// Format chat history
const context = memory.messages
  .map(m => \`\${m.role}: \${m.content}\`)
  .join('\\n');

return {
  userMessage,
  sessionId: $('Webhook').item.json.sessionId,
  context,
  previousMessages: memory.messages
};`}</pre>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="text-white/40" />
          </div>

          {/* Step 4 */}
          <div className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-l-4 border-orange-400 p-4 rounded">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">4</div>
              <h3 className="text-orange-300 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>AI Agent Node</h3>
            </div>
            <p className="text-white/70 text-sm ml-11 mb-2">
              Process with OpenAI/Claude with chat context
            </p>
            <div className="ml-11">
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-xs mb-2">System Prompt:</p>
                <code className="text-xs text-white/80 block">
                  {`You are a helpful assistant for SHINN PERFUME.\n\nChat History:\n{{$json.context}}\n\nAnswer the user's question based on context.`}
                </code>
              </div>
              <div className="bg-black/50 p-3 rounded mt-2">
                <p className="text-white/60 text-xs mb-2">User Message:</p>
                <code className="text-xs text-white/80">{`{{$json.userMessage}}`}</code>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="text-white/40" />
          </div>

          {/* Step 5 */}
          <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-l-4 border-green-400 p-4 rounded">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">5</div>
              <h3 className="text-green-300 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>HTTP Request - SAVE Memory</h3>
            </div>
            <p className="text-white/70 text-sm ml-11 mb-2">
              Save new conversation to memory
            </p>
            <div className="ml-11 space-y-2">
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-xs mb-1">Method:</p>
                <code className="text-green-300 text-xs">POST</code>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-xs mb-1">URL:</p>
                <code className="text-blue-300 text-xs break-all">
                  {`https://ynhtownozrawefwlxjyf.supabase.co/functions/v1/make-server-335e3812/memory/save`}
                </code>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-white/60 text-xs mb-1">Body (JSON):</p>
                <pre className="text-xs text-white/80 overflow-x-auto">{`{
  "sessionId": "{{$json.sessionId}}",
  "messages": [
    {
      "role": "user",
      "content": "{{$('Code').item.json.userMessage}}"
    },
    {
      "role": "assistant",
      "content": "{{$json.output}}"
    }
  ]
}`}</pre>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="text-white/40" />
          </div>

          {/* Step 6 */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border-l-4 border-cyan-400 p-4 rounded">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-cyan-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">6</div>
              <h3 className="text-cyan-300 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>Respond to Webhook</h3>
            </div>
            <p className="text-white/70 text-sm ml-11 mb-2">
              Return AI response to chatbot
            </p>
            <div className="ml-11">
              <div className="bg-black/50 p-3 rounded">
                <pre className="text-xs text-white/80">{`{
  "message": "{{$('AI Agent').item.json.output}}",
  "sessionId": "{{$json.sessionId}}"
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Points */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400 rounded-lg p-5">
        <h2 className="text-yellow-300 text-xl mb-4 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
          🔑 Key Points
        </h2>
        <ul className="space-y-2 text-white/80 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">•</span>
            <span>Use <code className="bg-black/50 px-2 py-1 rounded">sessionId</code> to identify each user's conversation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">•</span>
            <span>Memory is stored in Supabase KV store with key pattern: <code className="bg-black/50 px-2 py-1 rounded">chat_memory:sessionId</code></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">•</span>
            <span>Chat history persists across conversations - user can continue where they left off</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">•</span>
            <span>Use ANON_KEY for read/write operations (safe for client-side)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">•</span>
            <span>Optional: Implement memory cleanup for old sessions</span>
          </li>
        </ul>
      </div>

      {/* Session ID Generation */}
      <div className="bg-black/30 border border-white/20 rounded-lg p-5">
        <h2 className="text-white text-xl mb-4 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
          🆔 Session ID Strategies
        </h2>
        <div className="space-y-3">
          <div className="bg-black/50 p-4 rounded">
            <h3 className="text-green-300 text-sm mb-2">Option 1: User-based (if logged in)</h3>
            <code className="text-xs text-white/80">sessionId = "user_" + userId</code>
            <p className="text-white/60 text-xs mt-2">Best for authenticated users - memory follows across devices</p>
          </div>
          
          <div className="bg-black/50 p-4 rounded">
            <h3 className="text-blue-300 text-sm mb-2">Option 2: Browser-based (anonymous)</h3>
            <code className="text-xs text-white/80">sessionId = localStorage.getItem('chatSessionId') || generateUUID()</code>
            <p className="text-white/60 text-xs mt-2">For anonymous users - stored in browser localStorage</p>
          </div>
          
          <div className="bg-black/50 p-4 rounded">
            <h3 className="text-purple-300 text-sm mb-2">Option 3: Temporary session</h3>
            <code className="text-xs text-white/80">sessionId = "temp_" + Date.now()</code>
            <p className="text-white/60 text-xs mt-2">New session each time - no persistent memory</p>
          </div>
        </div>
      </div>

      {/* Example API Calls */}
      <div className="bg-black/30 border border-white/20 rounded-lg p-5">
        <h2 className="text-white text-xl mb-4 tracking-wider flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
          <Database className="w-6 h-6" />
          Example API Calls
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-purple-300 text-sm mb-2">Get Chat History (n8n HTTP Request):</h3>
            <div className="bg-black/50 p-3 rounded space-y-2 text-xs">
              <p className="text-white/60">Method: <span className="text-green-300">GET</span></p>
              <p className="text-white/60">URL:</p>
              <code className="text-blue-300 block break-all">
                https://ynhtownozrawefwlxjyf.supabase.co/functions/v1/make-server-335e3812/memory/user123
              </code>
              <p className="text-white/60 mt-2">Headers:</p>
              <code className="text-white/80">Authorization: Bearer [ANON_KEY]</code>
            </div>
          </div>

          <div>
            <h3 className="text-purple-300 text-sm mb-2">Save New Messages:</h3>
            <div className="bg-black/50 p-3 rounded space-y-2 text-xs">
              <p className="text-white/60">Method: <span className="text-green-300">POST</span></p>
              <p className="text-white/60">URL:</p>
              <code className="text-blue-300 block break-all">
                https://ynhtownozrawefwlxjyf.supabase.co/functions/v1/make-server-335e3812/memory/save
              </code>
              <p className="text-white/60 mt-2">Body:</p>
              <pre className="text-white/80 overflow-x-auto">{`{
  "sessionId": "user123",
  "messages": [
    { "role": "user", "content": "Tell me about Rose Élégance" },
    { "role": "assistant", "content": "Rose Élégance is a..." }
  ]
}`}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Success Indicator */}
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400 rounded-lg p-5 text-center">
        <div className="text-6xl mb-3">✅</div>
        <h2 className="text-green-300 text-2xl mb-2 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
          Setup Complete!
        </h2>
        <p className="text-white/80">
          Your AI Agent now has persistent memory without PostgreSQL connection
        </p>
      </div>
    </motion.div>
  );
}
