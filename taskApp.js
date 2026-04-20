const express = require('express');
const app = express();

app.use(express.json());

let tasks = [];
let currentId = 1;

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: "Task API is running 🐸",
        version: "1.0.0"
    });
});

// CREATE TASK
app.post('/tasks', (req, res) => {
    const { title } = req.body;

    if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Title is required' });
    }

    const task = {
        id: currentId++,
        title
    };

    tasks.push(task);

    res.status(201).json(task);
});

// GET TASKS
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// DELETE TASK
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    tasks.splice(index, 1);

    res.json({ message: 'Deleted' });
});

// reset helper untuk testing
function resetTasks() {
    tasks = [];
    currentId = 1;
}

module.exports = app;
module.exports.resetTasks = resetTasks;