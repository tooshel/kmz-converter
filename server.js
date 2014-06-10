var express = require('express');
var jade = require('jade'),
    multipart = require('multipart'),
    sys = require('sys');
//TODO: not using yet but probably should . . . right now this is a single user app!
var temp = require('temp');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

//var bodyParser = require("body-parser");
var multer  = require('multer');

var exec = require('child_process').exec;

//temp.track();

var app = express();
app.engine('jade', jade.__express);
app.set('port', process.env.PORT || 3000);
app.use(multer({
        dest: './uploads/',
        rename: function (fieldname, filename) {
            return filename.replace(/\W+/g, '-').toLowerCase();
        }
    }));

//app.use(bodyParser({keepExtensions: true, uploadDir: __dirname+'/uploads' }));
//app.use(multer({ dest: './uploads/'}));
app.use(express.static(__dirname + '/public'));



app.get('/', function(req, res){
  res.render('index.jade', { title: 'File Uploader' });
  //res.send('hello world');
});

app.post('/upload', function(req, res){
  //TODO: should check for this sometime
  var validtypes = ['kmz', 'zip']; // only process zip or kmz

  var response = {};
  res.message = "Nodey says: I got it!";
  res.link = "/downoads/finename.kmz";

  var stream = new multipart.Stream(req);
  stream.addListener('part', function(part) {
    part.addListener('body', function(chunk) {
      var progress = (stream.bytesReceived / stream.bytesTotal * 100).toFixed(2);
      var mb = (stream.bytesTotal / 1024 / 1024).toFixed(1);

      console.log("Uploading "+mb+"mb ("+progress+"%)\015");

      // chunk could be appended to a file if the uploaded file needs to be saved
    });
  });
  next()

  //TODO: yeah, this is ugly . . . but I need to wait till the file is written
  // setTimeout(function() {
  //   console.log('Timeout ended, starting to process file now');


  //   // var files = fs.readdirSync(__dirname+"/uploads/");
  //   // console.log("FILES read:", files);
  //   // console.log("FILES:", req.files.file.name);
  //   var originalfilename = req.files.file.name;

  //   kmzfile = fs.readFileSync("./uploads/"+req.files.file.name);

  //   //console.log(kmzfile);

  //   var zip = new require('node-zip')(kmzfile, {base64: false, checkCRC32: true});
    
  //   var photos = [];
  //   _.each(zip.folder("Photos").files, function (index, name) {
  //     var photoPrefix = "Photos/";
  //     if(name.search(photoPrefix) == 0 && name != photoPrefix) {
  //       var nameArr = name.split("/")
  //       //console.log("PHOTO:", nameArr[1]);
  //       photos.push(nameArr[1]);
  //     }

  //   });

  //   var file = zip.files['doc.kml'];
  //   var newfile = file._data.toString();
  //   _.each(photos, function (name, index) {
  //     var filename = name;
  //     //var pattern = /<a target="_blank" href="C:\\Users\\BRIAN_~1\\AppData\\Local\\Temp\\.*jpg">(.*)<\/a>/g
  //     //var pattern = /<a target="_blank" href="C:\\Users\\BRIAN_~1\\AppData\\Local\\Temp\\.*jpg">/g
  //     //newfile = newfile.replace(pattern, "$1");

  //     //console.log("PHOTO:", index, name);
  //     //newfile = newfile.replace('">'+filename, '"><a href="Photos/'+filename.toLowerCase()+'"><img width="200" src="Photos/'+filename.toLowerCase()+'" /></a><br>'+filename+'<br>');
  //     newfile = newfile.replace('">'+filename, '"><a href="Photos/'+filename.toLowerCase()+'"><img width="200" src="Photos/'+filename.toLowerCase()+'" /></a>');
  //     newfile = newfile.replace(''+filename, '');
  //     //newfile = newfile.replace(files[i], 'ae <img width="200" src="Photos/'+files[i]+'" />');
  //     //console.log("PHOTO:", index, name);
  //   });

  //   //console.log(newfile);
  //   zip.file('doc.kml', newfile);

  //   var data = zip.generate({base64:false,compression:'DEFLATE'});

  //   response.link = '/downloads/MAGIC-'+originalfilename;
  //   fs.writeFileSync('public/downloads/MAGIC-'+originalfilename, data, 'binary');

  //   res.json(response);

  // }, 7000);







  // temp.mkdir('KMZ', function(err, dirPath) {
  //   var inputPath = path.join(dirPath, 'temp.kmz');
  //   console.log("inputPath", inputPath);
  //   fs.writeFile(inputPath, myData, function(err) {
  //     if (err) throw err;



  //     // process.chdir(dirPath);
  //     // exec("texexec '" + inputPath + "'", function(err) {
  //     //   if (err) throw err;
  //     //   fs.readFile(path.join(dirPath, 'input.pdf'), function(err, data) {
  //     //     if (err) throw err;
  //     //     sys.print(data);
  //     //   });
  //     // });
  //   });
  //});




  //res.render('index.jade', { title: 'File Uploader' });
});

app.listen(app.get('port'));
console.log("Express on port %d, node version %s, NODE_ENV = %s", app.get('port'), process.version, process.env.NODE_ENV);



