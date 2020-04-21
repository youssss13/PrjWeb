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

/* *****************DATABASE ********************** */
var mysql = require('mysql');

var sql = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "prj_web"
});

sql.connect(function(err) {
  if (err) throw err;
  console.log("Database connected !");
  
});

/* ******************* END DATABASE ***************** */

app.get('/', (req, res) => {
  var params = querystring.parse(url.parse(req.url).query);
  if('search' in params)
  {
    var req = "SELECT * FROM USER WHERE login LIKE '%"+ params.search +"%'";
    sql.query(req, (err, result, fields) => {
    if (err) throw err;
    res.render('search', {result: result, title: params.search});
    });
  }
  else if('profile' in params)
  {
    // PAS DE PROTECTION CONTRE INJECTION ***********************************************************
    var req = "SELECT * FROM USER WHERE id = "+ params.profile;
    sql.query(req, (err, result, fields) => {
    if (err) throw err;
    console.log(result[0].login)
    res.render('profile', {person: result[0], title: result[0].login});
    });
  }
  else
  {
    res.render('index', {title: 'Accueil'});
  }
});

//Page de connexion

app.get('/login', (req, res) => {
  res.render('login', {title: 'Login'});
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
