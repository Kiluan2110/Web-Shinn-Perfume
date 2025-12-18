import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Database, Copy, Check, Eye, EyeOff, BookOpen, Settings } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { N8nMemoryGuide } from './N8nMemoryGuide';
import { N8nSetupGuide } from './N8nSetupGuide';

interface Credentials {
  supabaseUrl: string;
  supabaseDbUrl: string;
  supabaseServiceRoleKey: string;
  supabaseAnonKey: string;
  projectId: string;
  tableName: string;
}

export function DatabaseCredentials() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({
    serviceRoleKey: false,
    anonKey: false,
    dbUrl: false,
  });
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-335e3812/db-credentials`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setCredentials(data.credentials);
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testRestApi = async () => {
    if (!credentials) return;
    
    setTestLoading(true);
    setTestResult(null);
    
    try {
      const response = await fetch(
        `${credentials.supabaseUrl}/rest/v1/${credentials.tableName}?select=*&limit=5`,
        {
          headers: {
            'apikey': credentials.supabaseServiceRoleKey,
            'Authorization': `Bearer ${credentials.supabaseServiceRoleKey}`,
          },
        }
      );

      const data = await response.json();
      setTestResult({
        success: response.ok,
        status: response.status,
        data: data,
        message: response.ok ? '✅ Connection Successful!' : '❌ Connection Failed'
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: String(error),
        message: '❌ Connection Error'
      });
    } finally {
      setTestLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedField(field);
          setTimeout(() => setCopiedField(null), 2000);
        })
        .catch(() => {
          // Fallback to legacy method
          fallbackCopy(text, field);
        });
    } else {
      // Fallback to legacy method
      fallbackCopy(text, field);
    }
  };

  const fallbackCopy = (text: string, field: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      textArea.remove();
      
      if (successful) {
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleVisibility = (field: string) => {
    setShowSensitive(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const maskText = (text: string) => {
    if (text.length <= 20) return '••••••••••••••••';
    return text.substring(0, 10) + '••••••••••••••••' + text.substring(text.length - 10);
  };

  const CredentialField = ({ 
    label, 
    value, 
    field,
    sensitive = false 
  }: { 
    label: string; 
    value: string; 
    field: string;
    sensitive?: boolean;
  }) => {
    const isCopied = copiedField === field;
    const isVisible = showSensitive[field];
    const displayValue = sensitive && !isVisible ? maskText(value) : value;

    return (
      <div className="bg-black/30 border border-white/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-white/60 text-xs tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
            {label}
          </label>
          <div className="flex gap-2">
            {sensitive && (
              <button
                onClick={() => toggleVisibility(field)}
                className="text-white/40 hover:text-white transition-colors"
                title={isVisible ? "Hide" : "Show"}
              >
                {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={() => copyToClipboard(value, field)}
              className="text-white/40 hover:text-white transition-colors"
              title="Copy to clipboard"
            >
              {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <code className="text-white text-sm break-all block bg-black/50 p-2 rounded">
          {displayValue}
        </code>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!credentials) {
    return (
      <div className="text-center p-8">
        <p className="text-white/60">Failed to load credentials</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-6 h-6 text-white" />
        <h2 className="text-white tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
          Database Credentials for n8n
        </h2>
      </div>

      {/* Setup Guide CTA */}
      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-400 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-orange-300 text-xl mb-2 tracking-wider flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
              <Settings className="w-6 h-6" />
              <span>Cần Setup AI Chat trong n8n?</span>
            </h3>
            <p className="text-white/80 text-sm mb-4">
              Hướng dẫn chi tiết từng bước để tạo AI Chatbot hoàn chỉnh với Memory trong n8n - bao gồm configuration, code, và test examples.
            </p>
            <motion.button
              onClick={() => setShowSetupGuide(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg transition-all shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-5 h-5" />
              <span className="tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                XEM HƯỚNG DẪN SETUP N8N
              </span>
            </motion.button>
          </div>
          <div className="text-6xl">🤖</div>
        </div>
      </div>

      {/* Quick Guide */}
      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-2 border-green-400 rounded-lg p-5 mb-6">
        <h3 className="text-green-300 mb-3 tracking-wider flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
          <span className="text-2xl">🚀</span>
          <span>QUICK START: Use HTTP Request (No PostgreSQL Needed!)</span>
        </h3>
        <div className="bg-black/40 p-4 rounded-lg space-y-2 text-sm">
          <p className="text-white/90">1. In n8n, add an <strong className="text-green-300">HTTP Request</strong> node</p>
          <p className="text-white/90">2. Method: <code className="bg-black/50 px-2 py-1 rounded text-green-300">GET</code></p>
          <p className="text-white/90">3. URL: <code className="bg-black/50 px-2 py-1 rounded text-blue-300 break-all">{credentials.supabaseUrl}/rest/v1/{credentials.tableName}?select=*</code></p>
          <p className="text-white/90">4. Add Headers:</p>
          <div className="ml-4 space-y-1">
            <p className="text-white/70">• <code className="bg-black/50 px-2 py-1 rounded">apikey</code>: [Your Service Role Key below]</p>
            <p className="text-white/70">• <code className="bg-black/50 px-2 py-1 rounded">Authorization</code>: <code className="text-xs">Bearer [Your Service Role Key]</code></p>
          </div>
          <p className="text-green-300 mt-3">✨ That's it! No PostgreSQL connection issues!</p>
        </div>
      </div>

      {/* Error Explanation */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-red-300 text-sm mb-2 tracking-wider flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
          <span>⚠️</span>
          Why PostgreSQL Connection Failed (ENETUNREACH)?
        </h3>
        <ul className="text-white/70 text-sm space-y-1 list-disc list-inside">
          <li>Your n8n instance cannot reach Supabase's PostgreSQL IPv6 address</li>
          <li>Network firewall or routing issues blocking port 5432/6543</li>
          <li><strong className="text-green-300">Solution:</strong> Use REST API method above instead - it works everywhere!</li>
        </ul>
      </div>

      {/* Connection Examples */}
      <div className="bg-black/30 border border-white/20 rounded-lg p-4 mt-6">
        <h3 className="text-white text-sm mb-3 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
          📘 METHOD 1: n8n HTTP Request Node (RECOMMENDED)
        </h3>
        <div className="space-y-3 text-white/70 text-sm">
          <div className="bg-black/50 p-3 rounded">
            <p className="text-green-400 mb-2">✅ Get All Perfumes (SELECT)</p>
            <code className="block text-xs">
              GET {credentials.supabaseUrl}/rest/v1/{credentials.tableName}?select=*
            </code>
            <div className="mt-2 text-xs">
              <p className="text-white/50">Headers:</p>
              <p>apikey: [Service Role Key]</p>
              <p>Authorization: Bearer [Service Role Key]</p>
            </div>
          </div>

          <div className="bg-black/50 p-3 rounded">
            <p className="text-green-400 mb-2">✅ Filter by Category (WHERE)</p>
            <code className="block text-xs">
              GET {credentials.supabaseUrl}/rest/v1/{credentials.tableName}?key=like.perfume:her:*
            </code>
          </div>

          <div className="bg-black/50 p-3 rounded">
            <p className="text-green-400 mb-2">✅ Insert New Record (INSERT)</p>
            <code className="block text-xs">
              POST {credentials.supabaseUrl}/rest/v1/{credentials.tableName}
            </code>
            <div className="mt-2 text-xs">
              <p className="text-white/50">Body (JSON):</p>
              <pre className="text-xs">{`{
  "key": "perfume:her:4",
  "value": { "id": 4, "name": "..." }
}`}</pre>
            </div>
          </div>

          <div className="bg-black/50 p-3 rounded">
            <p className="text-green-400 mb-2">✅ Update Record (UPDATE)</p>
            <code className="block text-xs">
              PATCH {credentials.supabaseUrl}/rest/v1/{credentials.tableName}?key=eq.perfume:her:1
            </code>
            <div className="mt-2 text-xs">
              <p className="text-white/50">Body (JSON):</p>
              <pre className="text-xs">{`{ "value": { "id": 1, "name": "Updated Name" } }`}</pre>
            </div>
          </div>

          <div className="bg-black/50 p-3 rounded">
            <p className="text-green-400 mb-2">✅ Delete Record (DELETE)</p>
            <code className="block text-xs">
              DELETE {credentials.supabaseUrl}/rest/v1/{credentials.tableName}?key=eq.perfume:her:1
            </code>
          </div>
        </div>
      </div>

      {/* AI AGENT MEMORY API */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400 rounded-lg p-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-purple-300 tracking-wider flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
            <span className="text-2xl">🧠</span>
            <span>AI AGENT MEMORY API (For n8n Chat Memory)</span>
          </h3>
          <motion.button
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all shadow-lg text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen className="w-4 h-4" />
            <span style={{ fontFamily: 'Cinzel, serif' }}>Full Workflow Guide</span>
          </motion.button>
        </div>
        
        <div className="bg-black/40 p-4 rounded-lg mb-4">
          <p className="text-white/90 text-sm mb-2">
            Since PostgreSQL connection failed, use these HTTP endpoints for AI Agent chat memory:
          </p>
        </div>

        <div className="space-y-3 text-white/70 text-sm">
          <div className="bg-black/50 p-3 rounded">
            <p className="text-purple-400 mb-2">💾 Save Chat Message</p>
            <code className="block text-xs mb-2">
              POST {credentials.supabaseUrl}/functions/v1/make-server-335e3812/memory/save
            </code>
            <div className="mt-2 text-xs">
              <p className="text-white/50">Headers:</p>
              <p>Authorization: Bearer {credentials.supabaseAnonKey?.substring(0, 30)}...</p>
              <p className="text-white/50 mt-2">Body (JSON):</p>
              <pre className="text-xs">{`{
  "sessionId": "user123",
  "messages": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi there!" }
  ]
}`}</pre>
            </div>
          </div>

          <div className="bg-black/50 p-3 rounded">
            <p className="text-purple-400 mb-2">📖 Get Chat History</p>
            <code className="block text-xs">
              GET {credentials.supabaseUrl}/functions/v1/make-server-335e3812/memory/[sessionId]
            </code>
            <div className="mt-2 text-xs">
              <p className="text-white/50">Example:</p>
              <code className="text-xs">GET .../memory/user123</code>
            </div>
          </div>

          <div className="bg-black/50 p-3 rounded">
            <p className="text-purple-400 mb-2">🗑️ Clear Chat Memory</p>
            <code className="block text-xs">
              DELETE {credentials.supabaseUrl}/functions/v1/make-server-335e3812/memory/[sessionId]
            </code>
          </div>

          <div className="bg-black/50 p-3 rounded">
            <p className="text-purple-400 mb-2">📋 List All Sessions</p>
            <code className="block text-xs">
              GET {credentials.supabaseUrl}/functions/v1/make-server-335e3812/memory/sessions/list
            </code>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mt-4">
          <p className="text-blue-300 text-xs">
            💡 <strong>n8n Workflow Setup:</strong>
          </p>
          <ol className="text-white/70 text-xs mt-2 space-y-1 list-decimal list-inside">
            <li>Before AI Agent: HTTP Request to GET chat history</li>
            <li>Pass history to AI Agent context</li>
            <li>After AI Agent: HTTP Request to POST new messages</li>
          </ol>
        </div>
      </div>

      <div className="bg-black/30 border border-white/20 rounded-lg p-4 mt-6">
        <h3 className="text-white text-sm mb-3 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
          📘 METHOD 2: n8n PostgreSQL Node (May Not Work - Network Issues)
        </h3>
        <div className="space-y-2 text-white/70 text-sm">
          <p><strong>Connection Type:</strong> PostgreSQL</p>
          <p><strong>Connection String:</strong> Use the Database URL above</p>
          <p className="text-red-300 text-xs mt-2">
            ⚠️ If you see "ENETUNREACH" error, your network doesn't support IPv6 or can't reach Supabase PostgreSQL port. Use METHOD 1 instead.
          </p>
        </div>
      </div>

      {/* Test REST API Connection */}
      <div className="bg-black/30 border border-white/20 rounded-lg p-4 mt-6">
        <h3 className="text-white text-sm mb-3 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
          📘 TEST REST API CONNECTION
        </h3>
        <div className="space-y-2 text-white/70 text-sm">
          <button
            onClick={testRestApi}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
            disabled={testLoading}
          >
            {testLoading ? 'Testing...' : 'Test Connection'}
          </button>
          {testResult && (
            <div className="mt-2">
              <p className="text-sm font-bold">{testResult.message}</p>
              {testResult.success && (
                <div className="mt-2">
                  <p className="text-sm">Status: {testResult.status}</p>
                  <pre className="text-xs bg-black/50 p-2 rounded">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                </div>
              )}
              {!testResult.success && (
                <div className="mt-2">
                  <p className="text-sm">Error: {testResult.error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Credentials Fields */}
      <div className="space-y-4">
        <CredentialField 
          label="Project ID"
          value={credentials.projectId}
          field="projectId"
        />

        <CredentialField 
          label="Supabase URL"
          value={credentials.supabaseUrl}
          field="supabaseUrl"
        />

        <CredentialField 
          label="Database URL (PostgreSQL Connection String)"
          value={credentials.supabaseDbUrl}
          field="dbUrl"
          sensitive={true}
        />

        <CredentialField 
          label="Service Role Key (Full Access)"
          value={credentials.supabaseServiceRoleKey}
          field="serviceRoleKey"
          sensitive={true}
        />

        <CredentialField 
          label="Anon Key (Public)"
          value={credentials.supabaseAnonKey}
          field="anonKey"
          sensitive={true}
        />

        <CredentialField 
          label="Table Name"
          value={credentials.tableName}
          field="tableName"
        />
      </div>

      {/* Warning */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <p className="text-red-300 text-sm">
          ⚠️ <strong>Security Warning:</strong> Keep these credentials secure. The Service Role Key bypasses all Row Level Security policies.
        </p>
      </div>

      {/* Memory Guide Modal */}
      {showGuide && (
        <motion.div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowGuide(false)}
        >
          <motion.div
            className="bg-gradient-to-b from-gray-900 to-black border-2 border-purple-400 rounded-lg max-w-6xl w-full my-8"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              <N8nMemoryGuide />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Setup Guide Modal */}
      {showSetupGuide && (
        <motion.div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowSetupGuide(false)}
        >
          <motion.div
            className="bg-gradient-to-b from-gray-900 to-black border-2 border-purple-400 rounded-lg max-w-6xl w-full my-8"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowSetupGuide(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              <N8nSetupGuide />
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}