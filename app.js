require('babel-register')
const express = require('express')
const morgan = require('morgan')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan');
const mysql = require('mysql')
const session = require('express-session')

const PORT = 3000;

app.set('view engine', 'ejs')
app.set('views','view')

// app.use(session({
//     secret : 'keybord cat',
//     resave : false,
//     saveUninitialized : true,
//     cookie  : { secure : true}
// }))
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(express.static(__dirname+'/public'));

const db = mysql.createConnection({
    host: 'localhost', 
    database:'biomarket', 
    user: 'root', 
    password: ''
})

db.connect((err)=>{
    if(err){
        console.log(err.message); 
    }else{
        console.log('Vous êtes connecté a la base de donnée')
    }
})

//ROUTES

//get

app.get('/', (req, res) => {
    res.status(200).render("home")
})

app.get('/login', (req, res) => {
    res.status(200).render("marche")
})

app.get('/register', (req, res) => {
    res.status(200).render("register") 
})

app.get('/marche', (req, res) => {
    if(req.session.email){
        res.status(200).render("marche")
    }else{
        res.status(200).render("marche");   
    }
   
})

//Post : register

app.post('/register',(req,res)=>{

    var erreur = "Veuillez suivre les instruciton";
  
     var values = [req.body.nom, req.body.prenom, req.body.email, req.body.password,req.body.password2];
     if(req.body.password == req.body.password2){
        db.query('INSERT INTO clients (nom, prenom, email, password) values (?,?,?,?)', values ,(result,err)=>{
         res.redirect("http://localhost:3000/login");
    })
     }else{
        res.redirect("http://localhost:3000/register")
    }
})

//Post : Login
app.post('/login',(req,res)=>{
  
    if(db.query("SELECT * FROM client WHERE email=? AND password=?", values))
    { res.redirect("marche") }
    else
    {res.redirect("login")} 
   
})

// END ROUTES

app.listen(PORT, () => {
    console.log(`le serveur est lancé sur le port ${PORT}`)
})

// function error(){
//     return "Erreur";
// }
