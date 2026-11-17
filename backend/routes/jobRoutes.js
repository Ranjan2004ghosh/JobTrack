
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// GET all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ appliedDate: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new job
router.post('/', async (req, res) => {
    try {
        const job = new Job(req.body);
        const savedJob = await job.save();
        res.status(201).json(savedJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update job
router.put('/:id', async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.json(updatedJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE job
router.delete('/:id', async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);

        if (!deletedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
