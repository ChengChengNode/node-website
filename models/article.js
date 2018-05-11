let mongoose = require('mongoose');

let Article = mongoose.model('Article',{
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  subTitle:{
    type: String,
    default: null,
    trim: true,
    minlength: 1
  },
  text: {
    type: String,
    required: true,
    trim: true,
    minlength:1
  },
  publishDate: {
    type: String,
    default: new Date().toISOString()
  },
  author: {
    type: String,
    default: 'anonymous'
  }
});

module.exports = {
  Article
}
