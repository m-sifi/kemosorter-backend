const mongoose = require("mongoose");

const Save = new mongoose.Schema({
    name: { type: String, required: true, index: true, unique: true },

    // Data used at the time of sorting
    characters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Character"}],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category"}],

    timestamp: { type: Number, default: 0 },
    choices: { type: String , default: ''},
}, { 
    capped: 15728640, // 15mb max,
    max: 100,
    collection: 'save' 
});

// Result.plugin(require("mongoose-version"), { collection: 'result_versions' });
Save.plugin(require("mongoose-timestamp"),  {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = mongoose.model('Save', Save);