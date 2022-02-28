const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 3000;

// CORS policy: allow requests
app.use(cors());

// Serve static files
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

// Body parser middleware for request body in POST method
app.use(bodyParser.urlencoded({ extended: false }));

const createUser = require('./repository.js').createUser;
app.post('/api/users', (req, res) => {
    createUser(req.body.username, (err, doc) => {
        if (err) {
            console.error(err);
            res.json({ error: err });
            return;
        }
        const result = {
            _id: doc._id,
            username: doc.username,
        };
        res.json(result);
    });
});

const listUsers = require('./repository').listUsers;
app.get('/api/users', (req, res) => {
    listUsers((err, docs) => {
        if (err) {
            console.error(err);
            res.json({ error: err });
            return;
        }
        res.json(docs);
    });
});


const createexercise = require('./repository.js').createexercise;
app.post('/api/users/:_id/exercises', (req, res) => {
    createexercise(req.body, (err, doc) => {
        if (err) {
            console.error(err);
            res.json({ error: err });
            return;
        }
        res.json(doc);
    });
});





const listener = app.listen(port, () => {
    console.log('✅ your app is listening on port ' + listener.address().port);
});