import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Session-Id"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: false,
  }),
);

// Health check endpoint
app.get("/make-server-335e3812/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all perfumes (both Her and Him)
app.get("/make-server-335e3812/perfumes", async (c) => {
  try {
    const perfumes = await kv.getByPrefix("perfume:");
    return c.json({ 
      success: true, 
      data: perfumes.sort((a, b) => a.id - b.id) 
    });
  } catch (error) {
    console.log(`Error fetching perfumes: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get perfumes by category (her/him)
app.get("/make-server-335e3812/perfumes/:category", async (c) => {
  try {
    const category = c.req.param("category");
    if (category !== "her" && category !== "him") {
      return c.json({ success: false, error: "Invalid category" }, 400);
    }
    
    const perfumes = await kv.getByPrefix(`perfume:${category}:`);
    return c.json({ 
      success: true, 
      data: perfumes.sort((a, b) => a.id - b.id) 
    });
  } catch (error) {
    console.log(`Error fetching perfumes for category: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add a new perfume
app.post("/make-server-335e3812/perfumes", async (c) => {
  try {
    const perfume = await c.req.json();
    const { category, id } = perfume;
    
    if (!category || !id) {
      return c.json({ success: false, error: "Category and ID are required" }, 400);
    }
    
    const key = `perfume:${category}:${id}`;
    await kv.set(key, perfume);
    
    return c.json({ success: true, data: perfume });
  } catch (error) {
    console.log(`Error adding perfume: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update a perfume
app.put("/make-server-335e3812/perfumes/:category/:id", async (c) => {
  try {
    const category = c.req.param("category");
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    const key = `perfume:${category}:${id}`;
    const existing = await kv.get(key);
    
    if (!existing) {
      return c.json({ success: false, error: "Perfume not found" }, 404);
    }
    
    const updated = { ...existing, ...updates };
    await kv.set(key, updated);
    
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.log(`Error updating perfume: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete a perfume
app.delete("/make-server-335e3812/perfumes/:category/:id", async (c) => {
  try {
    const category = c.req.param("category");
    const id = c.req.param("id");
    const key = `perfume:${category}:${id}`;
    
    await kv.del(key);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting perfume: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Initialize database with default data
app.post("/make-server-335e3812/init-data", async (c) => {
  try {
    const { perfumes } = await c.req.json();
    
    if (!perfumes || !Array.isArray(perfumes)) {
      return c.json({ success: false, error: "Invalid data format" }, 400);
    }
    
    // Store each perfume
    for (const perfume of perfumes) {
      const key = `perfume:${perfume.category}:${perfume.id}`;
      await kv.set(key, perfume);
    }
    
    return c.json({ success: true, count: perfumes.length });
  } catch (error) {
    console.log(`Error initializing data: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// DEBUG: Get all raw data from KV store
app.get("/make-server-335e3812/debug/all-data", async (c) => {
  try {
    const allPerfumes = await kv.getByPrefix("perfume:");
    
    return c.json({ 
      success: true,
      count: allPerfumes.length,
      data: {
        her: allPerfumes.filter(p => p.category === 'her'),
        him: allPerfumes.filter(p => p.category === 'him'),
        all: allPerfumes
      }
    });
  } catch (error) {
    console.log(`Error fetching all data: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// DEBUG: Clear all data
app.delete("/make-server-335e3812/debug/clear-all", async (c) => {
  try {
    const allPerfumes = await kv.getByPrefix("perfume:");
    
    for (const perfume of allPerfumes) {
      const key = `perfume:${perfume.category}:${perfume.id}`;
      await kv.del(key);
    }
    
    return c.json({ 
      success: true, 
      message: `Cleared ${allPerfumes.length} perfumes from database` 
    });
  } catch (error) {
    console.log(`Error clearing data: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// DEBUG: Clear all memory entries
app.delete("/make-server-335e3812/debug/clear-memory", async (c) => {
  try {
    const allMemories = await kv.getByPrefix("chat_memory:");
    
    for (const memory of allMemories) {
      // Extract sessionId from the memory data or use key
      const key = `chat_memory:${memory.sessionId}`;
      await kv.del(key);
    }
    
    return c.json({ 
      success: true, 
      message: `Cleared ${allMemories.length} memory sessions from database` 
    });
  } catch (error) {
    console.log(`Error clearing memory: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get database credentials for n8n connection
app.get("/make-server-335e3812/db-credentials", (c) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseDbUrl = Deno.env.get('SUPABASE_DB_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    return c.json({
      success: true,
      credentials: {
        supabaseUrl,
        supabaseDbUrl,
        supabaseServiceRoleKey,
        supabaseAnonKey,
        projectId: supabaseUrl?.split('//')[1]?.split('.')[0],
        tableName: 'kv_store_335e3812',
      }
    });
  } catch (error) {
    console.log(`Error fetching credentials: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// AI AGENT MEMORY ENDPOINTS FOR N8N
// ============================================

// Unified Memory API endpoint - handles both get and save actions
app.post("/make-server-335e3812/memory", async (c) => {
  try {
    const { action, sessionId, messages } = await c.req.json();
    
    if (!sessionId) {
      return c.json({ success: false, error: "Session ID is required" }, 400);
    }
    
    const key = `chat_memory:${sessionId}`;
    
    // GET ACTION - retrieve memory
    if (action === "get") {
      console.log(`[Memory API] GET memory for session: ${sessionId}`);
      
      const memory = await kv.get(key);
      
      if (!memory) {
        console.log(`[Memory API] No memory found for session: ${sessionId}`);
        return c.json({ 
          memory: [],
          sessionId
        });
      }
      
      console.log(`[Memory API] Found ${memory.messages.length} messages for session: ${sessionId}`);
      
      return c.json({ 
        memory: memory.messages || [],
        sessionId
      });
    }
    
    // SAVE ACTION - store messages
    if (action === "save") {
      console.log(`[Memory API] SAVE memory for session: ${sessionId}`);
      
      if (!messages || !Array.isArray(messages)) {
        return c.json({ success: false, error: "Messages must be an array" }, 400);
      }
      
      // Get existing messages
      const existing = await kv.get(key) || { messages: [] };
      
      // Append new messages
      const updated = {
        sessionId,
        messages: [...existing.messages, ...messages],
        updatedAt: new Date().toISOString()
      };
      
      await kv.set(key, updated);
      
      console.log(`[Memory API] Saved ${messages.length} new messages. Total: ${updated.messages.length}`);
      
      return c.json({ 
        success: true,
        sessionId
      });
    }
    
    // Invalid action
    return c.json({ success: false, error: "Invalid action. Use 'get' or 'save'" }, 400);
    
  } catch (error) {
    console.log(`[Memory API] Error: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);