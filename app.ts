/// <reference path="./typings/tsd.d.ts" />

import{findUser} from './DBRepo/UserModel';
var GeneralRoutes = require('./routes/general')

import express = require('express');
import path = require('path');
import bodyParser = require('body-parser');
import mongoose = require('mongoose');


let app = express();
app.set('port',3000);


let staticDir = path.resolve(__dirname,'./static');
app.use(express.static(staticDir))
app.use(bodyParser.json());

app.use(function(req,res,next){
    if(req.query.token){
        findUser({FirebaseToken:req.query.token})
        .then(function(dbUser){
            if(dbUser){
                req.user = dbUser;
                next();
            }
        },function(err){
            next(err)
        });
    }else{
        next();
    }
});

app.use('/api',GeneralRoutes);



app.get('*',(req:express.Request,res:express.Response)=>{
    let indexFilePath = path.resolve(__dirname,'./static/adminPortal/index.html')
    res.sendFile(indexFilePath);
});

app.listen(app.get('port'),()=>{
    console.log('Server is running on port '+app.get('port'));
});

mongoose.connect('mongodb://localhost/data');