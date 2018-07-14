const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const twilio = require('twilio')('ACbcd3316257e65fced4dbd1a968c47610','2e180f2b7a3ba7a256d8527a25692ce2');
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// var xhr = new XMLHttpRequest();
// const enzyme = require('enzyme');
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const { window } = new JSDOM(`<!DOCTYPE html>`);
// // const $ = require('jQuery')(window);
// const $ = require('jquery')(window);

let {mongoose} = require('./db/mongoose');
let {Article} = require('./models/article');
let {User} = require('./models/user');
let {ArticleComment} =require('./models/comments');

const serverLogFile = __dirname + '/log/server.log';
const port = process.env.PORT || 3000;

let app = express();

app.use(bodyParser.json());
app.use('/',express.static(path.join(__dirname)));
app.use('/modules',express.static(path.join(__dirname,'node_modules')));
app.use('/image',express.static(path.join(__dirname, 'public/image')));
app.use('/js',express.static(path.join(__dirname, 'public/js')));
app.use('/css',express.static(path.join(__dirname, 'public/css')));
app.use('/vedio',express.static(path.join(__dirname, 'public/vedio')));
app.use('/files',express.static(path.join(__dirname, 'public/files')));
// app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine','hbs');

hbs.registerHelper('list', (items, options) => {
  var out = "";
  for(let i = 0, l = items.length; i < l ; i++){
    items[i].text = items[i].text.slice(0,500)+"......"
    out = out +  options.fn(items[i]);
  }
  return out;
});



app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`
  fs.appendFile(serverLogFile, log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});


app.get('/', (req, res) => {
  res.render('home.hbs',{
    pageTitle:'Home Page'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs',{
    pageTitle: 'About Page'
  });
});

app.get('/contact', (req, res) => {
  res.render('contact.hbs',{
    pageTitle: 'Contact Page'
  });
});

app.get('/blog', (req, res) => {
  Article.find().then((articles) => {
    // res.articles = articles;
    // let source = $("#src").html();
    // let template = hbs.compile(source);
    // $("articles").append(template({objects: articles}))
    res.render('blog.hbs',{articles: articles});
    // res.status(200).render('blog.hbs')
  },(err) => {
    res.status(400).send(err);
    console.log('Unable to fetch data from server.')
  });
});

app.get('/article/:articleId',(req, res) => {
  let comments = [];
  ArticleComment.find({articleID: req.params.articleId}).then((res) =>{
    comments = res;
  },(err) => {
    res.status(400).send(err);
  });
  console.log(comments);
  Article.find({_id: req.params.articleId}).then((article) => {
    res.render('article.hbs',{
      articleID: req.params.articleId,
      title: article[0].title,
      subTitle: article[0].subTitle,
      text: article[0].text,
      author: article[0].author,
      publishDate: article[0].publishDate,
      comments
    });
  },(err) => {
    res.status(400).send(err);
  });
});

app.post('/blog', (req, res) => {
  let article = new Article({
    subTitle: req.body.subTitle,
    text: req.body.text,
    title: req.body.title,
    author: req.body.author
  });
  article.save().then((doc) => {
    res.status(200).send(doc);
  },(err) => {
    res.status(400).send(err);
  })
});

app.post('/comment',(req, res) => {
  let aComment = new ArticleComment({
    articleID: req.body.articleID,
    text:req.body.text,
  });
  aComment.save().then((doc) => {
    res.status(200).send(doc);
  },(err) => {
    res.status(400).send(err);
  });
});

app.post('/contactSMS', (req, res) => {
  let text = req.body.text;
  // console.log(req.body);
  // res.send(200);
  // console.log(text);
  twilio.messages.create({
    to: '+8618054086728',
    from: '+14695356832',
    body: text
  }).then((message) => {
    //console.log(message);
    res.send(200);
  });
},(err) => {
  console.log(err);
});


app.listen(port,() => {
  console.log(`Server is up on port ${port}`);
});
