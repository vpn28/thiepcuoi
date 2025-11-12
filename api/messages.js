// API endpoint for managing wedding messages
// This works with Vercel Blob Storage

import { put, list } from '@vercel/blob';

// Allow CORS for your domain
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  try {
    // GET - Lấy tất cả messages
    if (req.method === 'GET') {
      const { blobs } = await list({
        prefix: 'wedding-messages/',
        limit: 1000,
      });

      // Fetch all message files
      const messages = [];
      for (const blob of blobs) {
        const response = await fetch(blob.url);
        const message = await response.json();
        messages.push(message);
      }

      // Sort by timestamp (newest first)
      messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return res.status(200).json(messages);
    }

    // POST - Thêm message mới
    if (req.method === 'POST') {
      const { name, count, attend, message } = req.body;

      if (!name || !count || !attend) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newMessage = {
        name,
        count,
        attend,
        message: message || '',
        timestamp: new Date().toISOString(),
      };

      // Save to Vercel Blob Storage
      const filename = `wedding-messages/${newMessage.timestamp}-${Date.now()}.json`;
      const blob = await put(filename, JSON.stringify(newMessage), {
        access: 'public',
        contentType: 'application/json',
      });

      return res.status(201).json({
        success: true,
        message: newMessage,
        blob: blob,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
