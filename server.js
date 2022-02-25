const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 3000;

// CORS policy: allow requests
app.use(cors());

// Serve static files
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});


const createUser = require('./repository.js').createUser;
app.post('/api/users', (req, res) => {
    createUser('axelsomerseth', (err, doc) => {
        if (err) {
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





const listener = app.listen(port, () => {
    console.log('✅ your app is listening on port ' + listener.address().port);
});