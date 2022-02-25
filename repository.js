//		MODELS

const user = {
    username: "fcc_test",
    _id: "5fb5853f734231456ccb3b05"
};

const excercise = {
    username: "fcc_test",
    description: "test",
    duration: 60,
    date: "Mon Jan 01 1990",
    _id: "5fb5853f734231456ccb3b05",
};

const log = {
    username: "fcc_test",
    count: 1,
    _id: "5fb5853f734231456ccb3b05",
    log: [{
        description: "test",
        duration: 60,
        date: "Mon Jan 01 1990",
    }]
};

// DB Connection
const mongoose = require('mongoose');
const { Schema } = mongoose;
const mySecrets = process.env['MONGO_URI'];
const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(mySecrets, connectionOptions)
    .then(() => console.debug('✅ database connected'))
    .catch(() => console.error(`❌ error connecting database: ${err}`));

// User model
const userSchema = new Schema({
    username: { type: String, required: true },
});
let User = mongoose.model('User', userSchema);

// Excercise model


// CRUD Operations
const createUser = (username, done) => {
    const user = new User({
        username,
    });
    user.save((err, doc) => {
        if (err) done(err);
        done(null, doc);
    });
};

// Exports
exports.createUser = createUser;