// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const parser = require('body-parser');
const path = require('path');
const compression = require('compression');

// Import Schemas
const berita = require('./schemas/berita');
const fauna = require('./schemas/fauna');
const flora = require('./schemas/flora');

// Initialize app
const app = express();

// // CORS Configuration: allow requests from your frontend domain
// const corsOptions = {
//   origin: 'https://tahura.vercel.app',
//   optionsSuccessStatus: 200
// };
app.use(cors());
app.use(compression());
app.use(parser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection using Mongoose
mongoose.connect('mongodb+srv://TAHURA:TAHURA123@tahura.cjtoycf.mongodb.net/TAHURA')
  .then(() => console.log('MongoDB connected to database: TAHURA'))
  .catch(err => console.error('MongoDB connection error:', err));


// Define API routes
app.get('/api/getFloraDetails/:id', async (req, res) => {
  try {
    const floraId = req.params.id;
    const floraDetails = await flora.findById(floraId).exec();
    if (!floraDetails) {
      return res.status(404).json({ error: 'Flora not found' });
    }
    res.json(floraDetails);
  } catch (error) {
    console.error('Error fetching flora details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getFaunaDetails/:id', async (req, res) => {
  try {
    const faunaId = req.params.id;
    const faunaDetails = await fauna.findById(faunaId).exec();
    if (!faunaDetails) {
      return res.status(404).json({ error: 'Fauna not found' });
    }
    res.json(faunaDetails);
  } catch (error) {
    console.error('Error fetching fauna details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getBeritaDetails/:id', async (req, res) => {
  try {
    const beritaId = req.params.id;
    const beritaDetails = await berita.findById(beritaId).exec();
    if (!beritaDetails) {
      return res.status(404).json({ error: 'Berita not found' });
    }
    res.json(beritaDetails);
  } catch (error) {
    console.error('Error fetching berita details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getAllFlora', async (req, res) => {
  try {
    const floraData = await flora.find();
    res.json(floraData);
  } catch (error) {
    console.error('Error fetching flora data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getPartialFlora', async (req, res) => {
  try {
    // Fetch only 5 documents and select specific fields
    const floraData = await flora.find({}, { 
      name: 1, 
      short_description: 1, 
      nameIlmiah: 1, 
      photos: { $slice: 1 }
    }).limit(5);
  
    res.json(floraData);
  } catch (error) {
    console.error('Error fetching flora data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getLoadFlora', async (req, res) => {
  try {
    // Get page and limit from query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;

    // Validate and sanitize the page and limit values
    if (page < 1) page = 1;
    if (limit < 1) limit = 6;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch the flora data with pagination and specific fields
    const floraData = await flora.find({}, { 
      name: 1, 
      nameIlmiah: 1, 
      short_description: 1, 
      photos: { $slice: 1 } // Only include the first photo
    })
    .skip(skip)
    .limit(limit)
    .collation({ locale: 'en', strength: 1 }); // Optional: adjust collation for better performance

    res.json(floraData);
  } catch (error) {
    console.error('Error fetching flora data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getAllFauna', async (req, res) => {
  try {
    const faunaData = await fauna.find();
    res.json(faunaData);
  } catch (error) {
    console.error('Error fetching fauna data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getPartialFauna', async (req, res) => {
  try {
    // Fetch only 5 documents and select specific fields
    const faunaData = await fauna.find({}, { 
      name: 1, 
      short_description: 1, 
      nameIlmiah: 1, 
      photos: { $slice: 1 } // Fetch only the first photo
    }).limit(5);

    res.json(faunaData);
  } catch (error) {
    console.error('Error fetching fauna data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getLoadFauna', async (req, res) => {
  try {
    // Get page and limit from query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;

    // Validate and sanitize the page and limit values
    if (page < 1) page = 1;
    if (limit < 1) limit = 6;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch the fauna data with pagination and specific fields
    const faunaData = await fauna.find({}, { 
      name: 1, 
      nameIlmiah: 1, 
      short_description: 1, 
      photos: { $slice: 1 } // Only include the first photo
    })
    .skip(skip)
    .limit(limit)
    .collation({ locale: 'en', strength: 1 }); // Optional: adjust collation for better performance

    res.json(faunaData);
  } catch (error) {
    console.error('Error fetching fauna data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getAllBerita', async (req, res) => {
  try {
    const beritaData = await berita.find();
    res.json(beritaData);
  } catch (error) {
    console.error('Error fetching berita data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getPartialBerita', async (req, res) => {
  try {
    // Fetch only 5 documents and select specific fields
    const beritaData = await berita.find({}, {
      title: 1,
      short_description: 1,
      date: 1,   
      photos: { $slice: 1 }
    }).limit(5);

    res.json(beritaData);
  } catch (error) {
    console.error('Error fetching berita data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getLoadBeritas', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const skip = (page - 1) * limit;

  try {
    const beritas = await berita.find()
      .skip(skip)
      .limit(limit);

    const totalCount = await berita.countDocuments();

    res.json({
      beritas,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching beritas:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Search Flora
app.get('/api/search/flora', async (req, res) => {
  const query = req.query.query || '';
  try {
    const results = await flora.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { nameIlmiah: new RegExp(query, 'i') }
      ]
    });
    res.json(results);
  } catch (error) {
    console.error('Error fetching Flora:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Search Fauna
app.get('/api/search/fauna', async (req, res) => {
  const query = req.query.query || '';
  try {
    const results = await fauna.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { nameIlmiah: new RegExp(query, 'i') }
      ]
    });
    res.json(results);
  } catch (error) {
    console.error('Error fetching Fauna:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle all other requests to serve the Angular frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html')); // Pastikan path ini benar
});

// Start the server
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
