// Imports and DB Connection
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

// Exercise model
const exerciseSchema = new Schema({
    userID: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: String, required: false },
});
let Exercise = mongoose.model('exercise', exerciseSchema);

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

const listUsers = (done) => {
    User.find((err, docs) => {
        if (err) done(err);
        done(null, docs);
    });
};

const getUser = (userID, done) => {
    User.findById(userID, (err, doc) => {
        if (err) done(err);
        done(null, doc);
    });
};

const createExercise = (exercisePayload, done) => {
    getUser(exercisePayload[':_id'], (err, user) => {
        if (err) done(err);
        if (!exercisePayload.date) {
            exercisePayload.date = new Date().toDateString();
        }
        const e = {
            userID: user._id,
            description: exercisePayload.description,
            duration: exercisePayload.duration,
            date: exercisePayload.date,
        };
        const exerciseModel = new Exercise(e);
        exerciseModel.save((err, exercise) => {
            if (err) done(err);
            const exerciseResponse = {
                // user fields
                _id: user._id,
                username: user.username,
                // exercise fields
                description: exercise.description,
                duration: exercise.duration,
                date: exercise.date,
            }
            done(null, exerciseResponse);
        });
    });
};

const listLogs = (userID, done) => {
    User.findById(userID, (err, user) => {
        if (err) done(err);
        Exercise.find({ userID: user._id }, (err, logs) => {
            if (err) done(err);
            const result = {
                _id: user._id,
                username: user.username,
                count: logs.length,
                log: logs.length && logs.map(e => ({
                    description: e.description,
                    duration: e.duration,
                    date: e.date
                })),
            };
            done(null, result);
        });
    });
};

// Exports
exports.createUser = createUser;
exports.listUsers = listUsers;
exports.createExercise = createExercise;
exports.listLogs = listLogs;