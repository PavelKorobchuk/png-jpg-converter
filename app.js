const fs = require('fs');
const path = require('path');
const express = require('express');
const stream = require('stream');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');
const multer = require('multer');
const app = express();
const Busboy = require('busboy');
var busboy = require('connect-busboy');
app.use(busboy());
const config = require('./public/config');
const Grid = require('gridfs-stream');
const busboyBodyParser = require('busboy-body-parser');
app.set('view engine', 'ejs');
app.use(busboyBodyParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(morgan('dev'));
app.use('/', express.static(__dirname + '/public'));
//var port = process.env.PORT || 5000;
var port = 3000;
mongoose.connect('mongodb://***');
var conn = mongoose.connection;
app.listen(port || 3000);
var cloudconvert = new (require('cloudconvert'))('dk9dSCqzKTOrUok-pUVNNeHacN3I4i8x7Tz_YwBOoDZQn0VNIOnkQTkHuS16VGLSECPNzgTAOKTlITdMik8fDw');

  var myFile,
      myUnicFile,
      myFileForConvert,
      inputFormatCut,
      outputFormat,
      myUnicFileId; 
      storage = multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, 'public/tmp-images/')
      },
     filename: function (req, file, cb) {
            myFile = file.originalname;
            myUnicFileId = (Math.random() * 1000).toFixed();
            myUnicFile = myUnicFileId + myFile;
            cb(null, myUnicFile) 
  }
});




//upload image
         Grid.mongo = mongoose.mongo;
         var gfs = new Grid(mongoose.connection.db);
         var fileId = mongoose.Types.ObjectId();

         app.post('/upload', function(req, res) {
                    outputFormat = req.body.format;
                    var part = req.files.file;
                    var fileName = 'img_' + part.name;
                    console.log(fileName)
                    
                    var writeStream = gfs.createWriteStream({
                            filename: fileName,
                            mode: 'w',
                            content_type: part.mimetype
                        });
                    writeStream.on('close', function(file){
                        
          
        });
                    writeStream.write(part.data);
                    writeStream.end();
                   res.send(fileName)
    });


    app.get('/upload/:filename', function(req, res){
    
    console.log("bla")
                    gfs.files.find({
            filename: req.params.filename
        }).toArray(function(err, files){
            console.log("blabla ", req.params.filename)
            if(files.length === 0){
                return res.status(400).send({
                    message: 'File not found'
                })
            }
            var readstream = gfs.createReadStream({
                    filename: files[0].filename
            });
            myUnicFile = req.params.filename.split('.');
            myUnicFile = myUnicFile[1]
            console.log('1 ffile === ', req.body);
            res.setHeader('Content-Type', 'image/jpg');

            readstream.pipe(cloudconvert.convert({
                    inputformat: myUnicFile,
                    outputformat: 'jpg',
                    converteroptions: {
                    quality : 75,
                } 
            }))
            readstream.pipe(res);
         
        });
            var uploadedFileForRemove;
            var removeFiles = function(callback){
                gfs.files.find({filename: req.params.filename}).toArray(function(err, files){               
                        uploadedFileForRemove = files[0]._id; 
                });
                setTimeout(function() {
                    callback();
                }, 5000);
            };
                    removeFiles(function(){                  
                        gfs.remove({_id: uploadedFileForRemove})
                        
                    })
    });
    app.get('*', function(req, res){
              res.sendFile(__dirname + '/public/index.html')
    });


