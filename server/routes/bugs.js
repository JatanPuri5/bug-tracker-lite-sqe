const express = require('express');
const router = express.Router();
const Bug = require('../models/Bug');

// GET /api/bugs — supports ?severity=&status= filters
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.severity) filter.severity = req.query.severity;
    if (req.query.status) filter.status = req.query.status;
    const bugs = await Bug.find(filter).sort({ createdAt: -1 });
    res.json(bugs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/bugs
router.post('/', async (req, res) => {
  try {
    const { title, description, severity } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const bug = await Bug.create({ title, description, severity });
    res.status(201).json(bug);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/bugs/:id
router.patch('/:id', async (req, res) => {
  try {
    const bug = await Bug.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bug) return res.status(404).json({ message: 'Bug not found' });
    res.json(bug);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/bugs/:id
router.delete('/:id', async (req, res) => {
  try {
    const bug = await Bug.findByIdAndDelete(req.params.id);
    if (!bug) return res.status(404).json({ message: 'Bug not found' });
    res.json({ message: 'Bug deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
