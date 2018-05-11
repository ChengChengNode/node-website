let mongoose = require('mongoose');

let ArticleComment = mongoose.model('ArticleComment',{
  articleID: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  text: {
    type: String,
    required: true,
    trim: true,
    minlength:1
  },
  commentDate: {
    type: String,
    default: new Date().toISOString()
  }
});

module.exports = {
  ArticleComment
}
