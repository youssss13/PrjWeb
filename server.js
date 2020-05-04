"use strict"
var express = require('express');
var mustache = require('mustache-express');
var cookieParser = require('cookie-parser');
var app = express();

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');
app.use(cookieParser());


var url = require('url');
var querystring = require('querystring');
var gds = "dfskjg jsdfzkjf fh 23515;:dh qjhbda b bjdhekzgj hhh!!:;,";

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


/* ***************** ACCES BDD ************************ */
function tesLogin(log, pwd)
{
  var req = "SELECT password FROM USER WHERE login = '"+ log +"'";
    sql.query(req, (err, result, fields) => {
    if (err) throw err;
    return true;
    });
}

function getUserID(log)
{
  var req = "SELECT id FROM USER WHERE login = '"+ log +"'";
    sql.query(req, (err, result, fields) => {
    if (err) throw err;
    return result[0].id;
    });
}
/* ******************************************************* */

app.get('/', (req, res) => {
  var params = querystring.parse(url.parse(req.url).query);
  if('search' in params)
  {
    // PAS DE PROTECTION CONTRE INJECTION ***********************************************************
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

app.post('/connect', urlencodedparser, (req, res) => {
  var login = req.body.login;
  var pwd = req.body.pwd;
  var success = false;
  var req = "SELECT password FROM USER WHERE login = '"+ login +"'";
    sql.query(req, (err, result, fields) => {
    if (err) throw err;
      var req = "SELECT id FROM USER WHERE login = '"+ login +"'";
      sql.query(req, (err, result, fields) => {
      if (err) throw err;
        console.log('ifscsrqt');/* ************************PB AVEC HEADER COOKIE */
        res.cookie('uID', result[0].id);
        res.cookie('uIDh', result[0].id + gds);
        res.send('/');
      });
    });
    res.redirect('login');
});

//******************************* PAGE INSCRIPTION */
app.get('/signup', (req, res) => {
  res.render('signup', {title: 'Inscription'});
});

app.post('/subscribe', urlencodedparser, (req, res) => {
  var pwd = req.body.pwd;
  if(pwd != req.body.pwd2)
  {
    res.render('signup', {message: 'Les mots de passe ne correspondent pas.', title: 'Inscription'});
  }

  var login = req.body.login;
  var dateSub = new Date();
  
  if(login.length < 4)
  {
    res.render('signup', {message: 'Login trop court.', title: 'Inscription'});
  }
    
  if(pwd.length < 6)
  {
    res.render('signup', {message: 'Mot de passe trop court.', title: 'Inscription'});
  }

  var req = "SELECT login FROM USER";
    sql.query(req, (err, result, fields) => {
    if (err) throw err;
      for(var j = 0; j < result.length; j++)
      {
        if(result[j].login == login)
        {
          res.render('signup', {message: 'Login déjà utilisé.', title: 'Inscription'});
        }
      }
    });

    var req = "insert into USER VALUES (null, '"+ login +"', '"+ pwd+"', '"+dateSub.getFullYear()+"-"+(dateSub.getMonth()+1)+"-"+dateSub.getDate()+"')";
    sql.query(req, (err, result, fields) => {
    if (err) throw err;
          res.render('index', {message: 'success', title: 'Accueil'});
    });

  
});

//Page de déconnexion

app.get('/disconnect', (req, res) => {
  //supprimer cookies
});


//pages inconnues

app.use(function(req, res, next){
  res.setHeader('Content-Type', 'text/plain');
  res.status(404).send('Page introuvable !');
});




app.listen(3000, () => console.log('listening on http://localhost:3000'));
