var express = require('express');
var jade = require('jade');
var busboy = require('connect-busboy');
var sys = require('sys')
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var uuid = require('node-uuid');
var favicon = require('serve-favicon');


//var multipart = require('multipart');
//var bodyParser = require("body-parser");
//var multer  = require('multer');
//var exec = require('child_process').exec;

var app = express();

app.use(favicon(__dirname + '/public/favicon.ico'));

app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);

app.use(busboy({ immediate: true }));
//app.use(multer({ dest: './uploads/'}));
// app.use(multer({
//         dest: './uploads/',
//         rename: function (fieldname, filename) {
//             return filename.replace(/\W+/g, '-').toLowerCase();
//         },
//         onFileUploadComplete: function(file) {
//           console.log(file.fieldname + ' uploaded to  ' + file.path);
//           theMagic(file);
//         }
//     }));
//app.use(bodyParser({keepExtensions: true, uploadDir: __dirname+'/uploads' }));


app.use(express.static(__dirname + '/public'));

// view engine setup

app.get('/', function(req, res){
  res.render('index.jade', { title: 'File Uploader' });
});

app.post('/upload', function(req, res){
  //TODO: should check for this sometime
  var validtypes = ['kmz', 'zip']; // only process zip or kmz

  var response = {};
  

  req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    var justname = path.basename(filename, path.extname(filename));
    var uniq = uuid.v4();
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    fs.mkdir(path.join("./uploads/", uniq));
    var saveTo = path.join(__dirname, "/uploads/", uniq, justname+'.zip');
    console.log("SAVETO:", saveTo);

    var output = fs.createWriteStream(saveTo);

    output.on("finish", function() {
      console.log('Done saving original file');
      response.link = theMagic(saveTo);
      console.log("LINK:", response);
      res.json(response);
    });

    file.pipe(output);

    file.on('data', function(data) {
    });

    file.on('end', function() {
    });
  });

  req.busboy.on('finish', function() {
  });
});

function theMagic(filepathandname) {
  console.log('Starting the Magic . . . ');

  //still need at least a one second delay so the stream can finish writing the last byte.
  //setTimeout(function() {

    // var files = fs.readdirSync(__dirname+"/uploads/");
    // console.log("FILES read:", files);
    // console.log("FILES:", req.files.file.name);
    //var originalfilename = req.files.file.name;
    var originalfilename = path.basename(filepathandname);
    var newname =  "MAGIC"+path.basename(filepathandname, path.extname(filepathandname))+".kmz";

    //kmzfile = fs.readFileSync("./uploads/"+req.files.file.name);
    kmzfile = fs.readFileSync(filepathandname);

    //console.log(kmzfile);

    var zip = new require('node-zip')(kmzfile, {base64: false, checkCRC32: true});
    
    var photos = [];
    _.each(zip.folder("Photos").files, function (index, name) {
      var photoPrefix = "Photos/";
      if(name.search(photoPrefix) == 0 && name != photoPrefix) {
        var nameArr = name.split("/")
        //console.log("PHOTO:", nameArr[1]);
        photos.push(nameArr[1]);
      }

    });

    var file = zip.files['doc.kml'];
    var newfile = file._data.toString();
    _.each(photos, function (name, index) {
      var filename = name;
      //var pattern = /<a target="_blank" href="C:\\Users\\BRIAN_~1\\AppData\\Local\\Temp\\.*jpg">(.*)<\/a>/g
      //var pattern = /<a target="_blank" href="C:\\Users\\BRIAN_~1\\AppData\\Local\\Temp\\.*jpg">/g
      //newfile = newfile.replace(pattern, "$1");

      //console.log("PHOTO:", index, name);

      // var find = '">'+filename;
      // var re = new RegExp(find, 'g');
      // newfile = newfile.replace(re, '"><a href="Photos/'+filename.toLowerCase()+'"><img width="200" src="Photos/'+filename.toLowerCase()+'" /></a>');

      newfile = newfile.replace('">'+filename, '"><a href="Photos/'+filename.toLowerCase()+'"><img width="200" src="Photos/'+filename.toLowerCase()+'" /></a>');
      newfile = newfile.replace(''+filename, '');

      //console.log("PHOTO:", index, name);
    });

    //console.log(newfile);

    zip.file('doc.kml', newfile);

    var data = zip.generate({base64:false,compression:'DEFLATE'});

    var uniq = uuid.v4();
    fs.mkdir(path.join("./public/downloads/", uniq));

    link = path.join('/downloads/', uniq, newname);
    console.log ("download Link:", link);
    fs.writeFileSync(path.join('./public/downloads/', uniq, newname), data, 'binary');

    return link;

  //}, 500);

}

app.listen(app.get('port'));
console.log("Express on port %d, node version %s, NODE_ENV = %s", app.get('port'), process.version, process.env.NODE_ENV);
