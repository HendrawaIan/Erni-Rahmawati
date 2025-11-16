
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;



app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Parse request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files dari folder WEBSITE_ERNI

// Endpoint proxy untuk Google Apps Script - Pendaftaran
app.post('/api/register', async (req, res) => {
  try {
    // Validasi data di server side
    if (!req.body.username || req.body.username.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Username tidak boleh kosong'
      });
    }
    
    if (!req.body.password || req.body.password.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Password tidak boleh kosong'
      });
    }
    
    // URL Google Apps Script Anda (gunakan URL deployment terbaru)
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxVAzhfV-0vlM4JEg2Lzpud8lgkslc0oC6tPCbKO5_7uvyqki1AqNBsC0LP1E_hpgIU/exec';
    
    console.log('Mengirim data pendaftaran ke Google Apps Script:', {
      username: req.body.username,
      hasPassword: !!req.body.password
    });
    
    // Forward data ke Google Apps Script (tanpa action, karena akan defaultnya adalah pendaftaran)
    const response = await axios.post(scriptURL, JSON.stringify({
      username: req.body.username,
      password: req.body.password
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Respons pendaftaran dari Google Apps Script:', response.data);
    
    // Kirim respons dari Google Apps Script ke klien
    res.json(response.data);
  } catch (error) {
    console.error('Error pendaftaran:', error);
    
    // Tangani error dari Apps Script
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      // Tangani error lainnya
      res.status(500).json({ 
        status: 'error', 
        message: 'Server error: ' + (error.message || 'Unknown error') 
      });
    }
  }
});

// Endpoint untuk memeriksa username
app.get('/api/check-username', async (req, res) => {
  try {
    const username = req.query.username;
    if (!username) {
      return res.status(400).json({ error: 'Username parameter required' });
    }
    
    // URL Google Apps Script dengan parameter
    const scriptURL = `https://script.google.com/macros/s/AKfycbxVAzhfV-0vlM4JEg2Lzpud8lgkslc0oC6tPCbKO5_7uvyqki1AqNBsC0LP1E_hpgIU/exec?checkUsername=${encodeURIComponent(username)}`;
    
    const response = await axios.get(scriptURL);
    res.json(response.data);
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ error: 'Failed to check username' });
  }
});

// Endpoint untuk login
app.post('/api/login', async (req, res) => {
  try {
    // Validasi data di server side
    if (!req.body.username || req.body.username.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Username tidak boleh kosong'
      });
    }
    
    if (!req.body.password || req.body.password.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Password tidak boleh kosong'
      });
    }
    
    // URL Google Apps Script Anda
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxVAzhfV-0vlM4JEg2Lzpud8lgkslc0oC6tPCbKO5_7uvyqki1AqNBsC0LP1E_hpgIU/exec';
    
    console.log('Mengirim permintaan login ke Google Apps Script:', {
      username: req.body.username,
      action: 'login'
    });
    
    // Forward data ke Google Apps Script dengan parameter action=login
    const response = await axios.post(scriptURL, JSON.stringify({
      username: req.body.username,
      password: req.body.password,
      action: 'login'
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Respons login dari Google Apps Script:', response.data);
    
    // Kirim respons dari Google Apps Script ke klien
    res.json(response.data);
  } catch (error) {
    console.error('Error login:', error);
    
    // Tangani error seperti pada endpoint register
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ 
        status: 'error', 
        message: 'Server error: ' + (error.message || 'Unknown error') 
      });
    }
  }
});

app.post('/api/forgotPassword', async (req, res) => {
  try {
    // Validasi data di server side
    if (!req.body.username || req.body.username.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Username tidak boleh kosong'
      });
    }
    
    // URL Google Apps Script Anda
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxVAzhfV-0vlM4JEg2Lzpud8lgkslc0oC6tPCbKO5_7uvyqki1AqNBsC0LP1E_hpgIU/exec';
    
    console.log('Mengirim permintaan verifikasi username ke Google Apps Script:', {
      username: req.body.username,
      action: 'checkUser'
    });
    
    // Forward data ke Google Apps Script dengan parameter action=checkUser
    const response = await axios.post(scriptURL, JSON.stringify({
      username: req.body.username,
      action: 'checkUser'
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Respons verifikasi dari Google Apps Script:', response.data);
    
    // Kirim respons dari Google Apps Script ke klien
    res.json(response.data);
  } catch (error) {
    console.error('Error verifikasi username:', error);
    
    // Tangani error seperti pada endpoint lainnya
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ 
        status: 'error', 
        message: 'Server error: ' + (error.message || 'Unknown error') 
      });
    }
  }
});

app.post('/api/resetPassword', async (req, res) => {
  try {
    // Validasi data di server side
    if (!req.body.username || req.body.username.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Username tidak boleh kosong'
      });
    }
    
    if (!req.body.newPassword || req.body.newPassword.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Password baru tidak boleh kosong'
      });
    }
    
    // URL Google Apps Script
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxVAzhfV-0vlM4JEg2Lzpud8lgkslc0oC6tPCbKO5_7uvyqki1AqNBsC0LP1E_hpgIU/exec';
    
    console.log('Mengirim permintaan reset password ke Google Apps Script:', {
      username: req.body.username,
      action: 'resetPassword'
    });
    
    // Forward data ke Google Apps Script dengan parameter action=resetPassword
    const response = await axios.post(scriptURL, JSON.stringify({
      username: req.body.username,
      newPassword: req.body.newPassword,
      action: 'resetPassword'
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Respons reset password dari Google Apps Script:', response.data);
    
    // Kirim respons dari Google Apps Script ke klien
    res.json(response.data);
  } catch (error) {
    console.error('Error reset password:', error);
    
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ 
        status: 'error', 
        message: 'Server error: ' + (error.message || 'Unknown error') 
      });
    }
  }
});



// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});