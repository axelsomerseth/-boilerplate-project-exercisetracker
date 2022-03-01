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
    date: { type: Date, required: false },
});
let Exercise = mongoose.model('Exercise', exerciseSchema);

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

const createExercise = (user, exercisePayload, done) => {
    const isValidDate = exercisePayload.date &&
        new Date(exercisePayload.date).toDateString() !== 'Invalid Date';
    if (isValidDate) {
        exercisePayload.date = new Date(exercisePayload.date);
    } else {
        exercisePayload.date = new Date(Date.now());
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
            date: exercise.date.toDateString(),
        }
        done(null, exerciseResponse);
    });
};

const listLogs = (user, filters, done) => {
    const queryFilters = {
        userID: user._id,
    }
    if (filters.from || filters.to) {
        queryFilters.date = {};
        if (filters.from) queryFilters.date.$gte = filters.from;
        if (filters.to) queryFilters.date.$lte = filters.to;
    }
    Exercise.find(queryFilters, (err, logs) => {
        if (err) done(err);
        const result = {
            _id: user._id,
            username: user.username,
            count: logs.length,
            log: logs.length && logs.map(e => ({
                description: e.description,
                duration: e.duration,
                date: e.date.toDateString()
            })),
        };
        done(null, result);
    }).limit(filters.limit || null);
};

// Exports
exports.createUser = createUser;
exports.getUser = getUser;
exports.listUsers = listUsers;
exports.createExercise = createExercise;
exports.listLogs = listLogs;