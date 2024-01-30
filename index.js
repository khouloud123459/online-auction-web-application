
const express = require("express");
const path = require('path')
const router=express.Router();
const cors = require('cors');
require('dotenv').config();




const mysql = require("mysql");
const util = require('util');
const db=require('./db/dbConnection')
const bodyParser = require('body-parser');
const session = require("express-session");
const adRouter = require('./routes/ad');
const roomRouter = require('./routes/room'); // Add this line
const inscriptionRouter= require('./routes/inscription')
const loginRouter= require('./routes/login')
const searchRouter=require('./routes/search')
const adminloginRouter=require('./routes/adminlogin')
const bidRouter=require('./routes/bid')
const userrouter=require('./routes/getuser')


const app = express();
const port = 5002;





app.use(
  session({
    secret: 'Auctionwebsite', // replace with a strong, random secret key
    resave: true,
    saveUninitialized: true,
  })
);


app.use(bodyParser.json());

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());



app.get('/',function(req,res){
    db.query('SELECT * FROM ads',(err,result)=>{
        res.render('pages/index',{result:result});
})

})
app.get('/search.ejs',function(req,res){
    db.query('SELECT * FROM ads',(err,result)=>{
        res.render('pages/search',{result:result});
})

})
 


app.listen(port);

   
 // Routes
 


app.use('/',require('./routes/index'))
app.use('/ad', adRouter);
app.use('/room', roomRouter);
app.use('/inscription', inscriptionRouter);
app.use('/login', loginRouter);
app.use('/search', searchRouter);
app.use('/adminlogin', adminloginRouter);
app.use('/bid', bidRouter);
app.use('/getuser', userrouter);


  

app.get('/about.ejs', (req, res) => {
    res.render('pages/about')
});

app.get('/addAd.ejs', (req, res) => {
    res.render('pages/addAd')
});
app.get('/special.ejs', (req, res) => {
    res.render('pages/special')
});
app.get('/login.ejs', (req, res) => {
    res.render('pages/login')
});
app.get('/Room.ejs', (req, res) => {
    var item;
    res.render('pages/Room',{item:item})
});
app.get('/search.ejs', (req, res) => {
    res.render('pages/search')
});
app.get('/inscription.ejs', (req, res) => {
 var message;
    res.render('pages/inscription', {message: message})
});
app.get('/profile.ejs', (req, res) => {
    var item;
    res.render('pages/profile')
});
app.get('/adminlogin.ejs', (req, res) => {
    res.render('pages/adminlogin')
});
app.get('/admin.ejs',function(req,res){
    db.query('SELECT * FROM ads',(err,result)=>{
        res.render('pages/admin',{result:result});
})

})
app.get('/AdminRoom.ejs', (req, res) => {
   var successMessage;
    res.render('pages/AdminRoom', {successMessage: successMessage})
});
app.get('/bidsList.ejs', (req, res) => {
    res.render('page/bidsList')
});