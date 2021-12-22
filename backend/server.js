const express = require('express');
const mongoose = require('mongoose');
const { Status } = require('./db_schemas/status');
const { Transition } = require('./db_schemas/transition');
require('dotenv').config();

const hostname = '0.0.0.0';
const port = 8000;
const server = express();
server.use(express.json());

/* To avoid CORS Policy errors */
server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
});

/* Get all statuses */
server.get('/api/statuses', async (req, res) => {
  try {
    const statuses = await Status.find();
    res.send({ statuses });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/* Get status by name */
server.get('/api/statuses/:name', async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return;
    }

    const status = await Status.findOne({ name: name });
    res.send({ status });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/* Get all transitions */
server.get('/api/transitions', async (req, res) => {
  try {
    const transitions = await Transition.find();
    res.send({ transitions });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/* Get transition by name */
server.get('/api/transitions/:name', async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return;
    }

    const transition = await Transition.findOne({ name: name });
    res.send({ transition });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/* Delete Configuration */
server.delete('/api/delete', async (req, res) => {
  try {
    await Status.deleteMany({});
    await Transition.deleteMany({});

    res.send({ success: 'deleted successfully' });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/* Save configuration */
server.post('/api/save', async (req, res) => {
  try {
    await Status.deleteMany({});
    await Transition.deleteMany({});

    req.body.statuses.forEach(async (status) => {
      const newStatus = new Status(status);
      await newStatus.save();
    });

    req.body.transitions.forEach(async (transition) => {
      const newTransition = new Transition(transition);
      await newTransition.save();
    });

    res.send({ success: 'saved successfully' });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useMongoClient: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error("Conldn't connect to MongoDB", err));

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
