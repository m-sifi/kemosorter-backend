const mongoose = require("mongoose");

const Result = new mongoose.Schema({
    name: { type: String, required: true, index: true, unique: true },
    timestamp: { type: Number, default: 0 },
    duration: { type: Number, default: 0 }, // Duration taken during sort

    ranking: [{
        rank: Number,
        character: { type: mongoose.Schema.Types.ObjectId, ref: "Character" }
    }]
}, { collection: 'result' });

// Result.plugin(require("mongoose-version"), { collection: 'result_versions' });
Result.plugin(require("mongoose-timestamp"),  {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = mongoose.model('Result', Result);