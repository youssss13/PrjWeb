"use strict"
var express = require('express');
var mustache = require('mustache-express');

var app = express();

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');

var url = require('url');
var querystring = require('querystring');

app.use(express.static(__dirname + '/public'));


//index

app.get('/', (req, res) => {
  var params = querystring.parse(url.parse(req.url).query);
  if('search' in params)
  {
    //profils exemples en attendant la mise en place de la base de données
    res.render('search',{person: [{id : 1, name: 'DJ Khaled', birthdate : "05-09-1998", description : "gneugneugneu", register : "02-03-2020"}, {id : 2, name: 'Con Finés', birthdate : "05-09-1998", description : "gneugneugneu", register : "02-03-2020"},{id : 3, name: 'Jean Sorpa', birthdate : "05-09-1998", description : "gneugneugneu", register : "02-03-2020"}]})
  }
  else if('profile' in params)
  {
    res.render('profile',{id : params.profile});
  }
  else
  {
    res.render('index');
  }
});

//Page de connexion

app.get('/login', (req, res) => {
  res.render('login');
});

var bodyParser = require('body-parser');
var urlencodedparser = bodyParser.urlencoded({ extended: false });

app.post('/login', urlencodedparser, (req, res) => {
  res.send("id : " + req.body.login + " pwd : " + req.body.pwd);
});


//pages inconnues

app.use(function(req, res, next){
  res.setHeader('Content-Type', 'text/plain');
  res.status(404).send('Page introuvable !');
});





app.listen(3000, () => console.log('listening on http://localhost:3000'));
