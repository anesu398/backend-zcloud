const express = require('express');
const router = express.Router();
const usersService = require('../models/users.service');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await usersService.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a user
router.post('/', async (req, res) => {
  try {
    const user = await usersService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
