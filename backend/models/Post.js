// backend/models/Post.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
  author:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new Schema({
  author:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text:       { type: String, required: true },
  spotifyUrl: { type: String },            // opcional, se você quiser validar links
  likes:      [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments:   [CommentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
