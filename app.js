const express = require("express");
var app = express();
var bodyParser = require('body-parser');
var db = require('./db');
var port = process.env.PORT || 3000;
const server = require('http').createServer(app);
const io = require('socket.io')(server);


app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

// home page
app.get("/",(req,res)=>{

    res.render("pages/index");

});

// submit post request
app.post("/submit",(req,res)=>{
    var pargraphs = req.body.paras;
    
    // also passing socket variable to share progress with frontend
    db.insert(pargraphs,io).then((success)=>{      
        res.send(success);
    }).catch((err)=>{
        res.send(err);
    })
    
})

// search post request
app.post("/search",(req,res)=>{
    var word = req.body.word;
    word  = word.trim().toLowerCase()
    console.log(word);
    
    db.search(word).then((documentIds)=>{
        db.getParagraphs(documentIds).then((result)=>{
            res.render("pages/result",{
                result:{
                    word,
                    documentIds,
                    pargraphs:result
                }
            });
        }).catch((err)=>{
            res.send(err);
        })
        
    }).catch((err)=>{
        res.send(err);
        console.log(err);
    })
})

// deleting indexing
app.get("/delete",(req,res)=>{
    db.deleteIndexing();
    res.send("done");

})



server.listen(port, () => {
    console.log("App running on port " + port);
})


