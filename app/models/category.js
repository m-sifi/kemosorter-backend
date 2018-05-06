const mongoose = require('mongoose');

const Category = new mongoose.Schema({
    name: { type: String, required: true, index: true, unique: true }
}, { collection: 'category' });

// Category.plugin(require('mongoose-version'), { collection: 'category_versions' });
Category.plugin(require('mongoose-timestamp'),  {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = mongoose.model('Category', Category);