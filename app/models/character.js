const mongoose = require("mongoose");

const Character = new mongoose.Schema({
    name: { type: String, required: true, index: true, unique: true },
    image: { type: String, required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }]
}, { collection: "character" });

// Character.plugin(require("mongoose-unique-array"));
// Character.plugin(require("mongoose-version"), { collection: "character_versions"});
Character.plugin(require("mongoose-timestamp"),  {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = mongoose.model('Character', Character);