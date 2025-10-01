import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for demo purposes
interface Idea {
  id: string;
  text: string;
  upvotes: number;
  created_at: string;
}

let ideas: Idea[] = [
  {
    id: uuidv4(),
    text: "Create an AI-powered personal assistant that learns from your daily routines and proactively suggests optimizations.",
    upvotes: 12,
    created_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    text: "Build a platform that connects local farmers directly with consumers, eliminating middlemen and ensuring fair prices.",
    upvotes: 8,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: uuidv4(),
    text: "Develop a smart waste management system that uses IoT sensors to optimize garbage collection routes and reduce environmental impact.",
    upvotes: 15,
    created_at: new Date(Date.now() - 7200000).toISOString()
  }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Idea Board API is running' });
});

// Get all ideas
app.get('/api/ideas', async (req, res) => {
  try {
    // Sort by upvotes (descending) and then by creation date (descending)
    const sortedIdeas = [...ideas].sort((a, b) => {
      if (b.upvotes !== a.upvotes) {
        return b.upvotes - a.upvotes;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    res.json(sortedIdeas);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
});

// Create a new idea
app.post('/api/ideas', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Idea text is required' });
    }
    
    if (text.length > 280) {
      return res.status(400).json({ error: 'Idea text must be 280 characters or less' });
    }
    
    const newIdea: Idea = {
      id: uuidv4(),
      text: text.trim(),
      upvotes: 0,
      created_at: new Date().toISOString()
    };
    
    ideas.unshift(newIdea); // Add to beginning of array
    
    res.status(201).json(newIdea);
  } catch (error) {
    console.error('Error creating idea:', error);
    res.status(500).json({ error: 'Failed to create idea' });
  }
});

// Upvote an idea
app.post('/api/ideas/:id/upvote', async (req, res) => {
  try {
    const { id } = req.params;
    
    const ideaIndex = ideas.findIndex(idea => idea.id === id);
    
    if (ideaIndex === -1) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    ideas[ideaIndex].upvotes += 1;
    
    res.json(ideas[ideaIndex]);
  } catch (error) {
    console.error('Error upvoting idea:', error);
    res.status(500).json({ error: 'Failed to upvote idea' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Demo ideas loaded: ${ideas.length}`);
});
