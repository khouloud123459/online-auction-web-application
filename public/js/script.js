var express=require("express")
var ejs =require("ejs")
var app=express();
app.listen(3000);
app.get('/',function(req,res){
    res.send("hello")
});