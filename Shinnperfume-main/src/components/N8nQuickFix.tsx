import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle, Copy, Zap } from 'lucide-react';
import { useState } from 'react';

export function N8nQuickFix() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const CopyButton = ({ code, id }: { code: string; id: string }) => (
    <button
      onClick={() => copyCode(code, id)}
      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white/60 hover:text-white p-2 rounded transition-colors"
    >
      {copied === id ? (
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
      className="space-y-6 text-white"
    >
      {/* Error Alert */}
      <div className="bg-red-500/20 border-2 border-red-400 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-8 h-8 text-red-400" />
          <div>
            <h2 className="text-2xl tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
              ❌ Failed to receive response
            </h2>
            <p className="text-white/70 text-sm mt-1">
              n8n workflow không trả về response cho chat widget
            </p>
          </div>
        </div>
      </div>

      {/* Quick Fix Steps */}
      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-400 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-orange-400" />
          <h2 className="text-2xl tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
            ⚡ QUICK FIX - 3 Bước
          </h2>
        </div>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="bg-black/30 border-l-4 border-orange-400 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center">1</div>
              <h3 className="text-xl">Activate Workflow</h3>
            </div>
            <p className="text-white/70 text-sm mb-2">
              Vào n8n workflow → Toggle switch ở góc trên phải → Chuyển sang <span className="text-green-400">ACTIVE</span>
            </p>
            <div className="bg-green-500/10 border border-green-400 rounded p-2 text-sm">
              ✅ Switch phải màu xanh lá
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-black/30 border-l-4 border-blue-400 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">2</div>
              <h3 className="text-xl">Thêm "Respond to Webhook" Node</h3>
            </div>
            <p className="text-white/70 text-sm mb-3">
              Workflow PHẢI có node này ở cuối để trả response:
            </p>
            
            <div className="space-y-3">
              <div className="bg-blue-500/10 border border-blue-400/50 rounded p-3">
                <p className="text-blue-300 text-sm mb-2">1. Kéo node mới vào workflow:</p>
                <p className="text-white/80 text-sm">Search: <code className="bg-black/50 px-2 py-1 rounded">Respond to Webhook</code></p>
              </div>

              <div className="bg-blue-500/10 border border-blue-400/50 rounded p-3">
                <p className="text-blue-300 text-sm mb-2">2. Connect từ AI Agent → Respond to Webhook</p>
              </div>

              <div className="bg-blue-500/10 border border-blue-400/50 rounded p-3">
                <p className="text-blue-300 text-sm mb-2">3. Config node:</p>
                <div className="space-y-2 mt-2">
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-white/60 text-xs">Respond With:</p>
                    <code className="text-green-300 text-sm">Using Fields Below</code>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-white/60 text-xs">Response Body:</p>
                    <code className="text-green-300 text-sm">JSON</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-black/30 border-l-4 border-green-400 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">3</div>
              <h3 className="text-xl">Config Response Body</h3>
            </div>
            <p className="text-white/70 text-sm mb-3">
              Trong "Respond to Webhook" node, set Body:
            </p>
            
            <div className="relative">
              <pre className="text-xs bg-black/70 p-4 rounded overflow-x-auto text-green-300 border border-green-400/30">{`{
  "output": "={{ $json.output || $json.text || $json.content }}",
  "sessionId": "={{ $('Webhook').item.json.sessionId }}"
}`}</pre>
              <CopyButton code={`{
  "output": "={{ $json.output || $json.text || $json.content }}",
  "sessionId": "={{ $('Webhook').item.json.sessionId }}"
}`} id="response-body" />
            </div>

            <div className="mt-3 bg-yellow-500/10 border border-yellow-400 rounded p-3">
              <p className="text-yellow-300 text-xs">
                ⚠️ Nếu AI node của bạn tên khác, replace <code className="bg-black/50 px-1 rounded">$json.output</code> với field phù hợp
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative: Simple Workflow */}
      <div className="bg-purple-500/10 border-2 border-purple-400 rounded-lg p-6">
        <h2 className="text-2xl mb-4 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
          🚀 Alternative: Simple Test Workflow
        </h2>
        <p className="text-white/70 mb-4">
          Nếu workflow phức tạp quá, tạo workflow đơn giản để test:
        </p>

        <div className="space-y-3">
          <div className="bg-black/50 p-4 rounded">
            <h3 className="text-purple-300 mb-2">Node 1: Webhook</h3>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• HTTP Method: POST</li>
              <li>• Path: chat-simple</li>
              <li>• Response Mode: Using 'Respond to Webhook' Node</li>
            </ul>
          </div>

          <div className="bg-black/50 p-4 rounded">
            <h3 className="text-purple-300 mb-2">Node 2: Respond to Webhook</h3>
            <div className="relative mt-2">
              <pre className="text-xs bg-black/70 p-3 rounded text-green-300">{`{
  "output": "Xin chào! Đây là test response từ n8n",
  "sessionId": "={{ $json.sessionId }}"
}`}</pre>
              <CopyButton code={`{
  "output": "Xin chào! Đây là test response từ n8n",
  "sessionId": "={{ $json.sessionId }}"
}`} id="simple-response" />
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-400 rounded p-3">
            <p className="text-green-300 text-sm">
              ✅ Activate workflow này và test với Chat Test page
            </p>
          </div>
        </div>
      </div>

      {/* Common Mistakes */}
      <div className="bg-red-500/10 border border-red-400 rounded-lg p-6">
        <h2 className="text-xl mb-4 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
          ⚠️ Common Mistakes
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-red-400 mt-1">❌</span>
            <div>
              <p className="text-white">Workflow không ACTIVE</p>
              <p className="text-white/60 text-xs">→ Toggle switch phải ON</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-400 mt-1">❌</span>
            <div>
              <p className="text-white">Thiếu "Respond to Webhook" node</p>
              <p className="text-white/60 text-xs">→ Phải có ở cuối workflow</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-400 mt-1">❌</span>
            <div>
              <p className="text-white">Response body sai format</p>
              <p className="text-white/60 text-xs">→ Phải có field "output"</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-400 mt-1">❌</span>
            <div>
              <p className="text-white">AI node có lỗi (API key, quota)</p>
              <p className="text-white/60 text-xs">→ Check execution logs trong n8n</p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Again */}
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400 rounded-lg p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
        <h2 className="text-2xl mb-3 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
          Sau khi fix xong
        </h2>
        <p className="text-white/80 mb-4">
          Quay lại Chat Test page và test lại webhook
        </p>
        <div className="inline-block bg-black/30 px-6 py-3 rounded-lg">
          <p className="text-green-300">
            Expected response: <code className="bg-black/50 px-2 py-1 rounded text-xs">{"{ \"output\": \"...\", \"sessionId\": \"...\" }"}</code>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
