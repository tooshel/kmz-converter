var fs = require("fs");


var parseString = require('xml2js').parseString;
var xml2js = require('xml2js');


var files = fs.readdirSync("kml/Photos");

//console.log(aa);

var xml = "<root>Hello xml2js!</root>"


fs.readFile('kml/doc.kml', 'utf8', function (err,originalfile) {
  if (err) {
    return console.log(err);
  }
  
  // var xml = new XmlDocument();
  // xml.LoadXml(originalfile);
  // console.log(xml.DocumentElement.SelectSingleNode("/Document/Folder/Placemark/description").InnerText);


  // parseString(originalfile, function (err, result) {
  //     //console.dir(result.kml.Document[0].Folder[0].Placemark[0].description);

  //     var builder = new xml2js.Builder();
  //     var xml = builder.buildObject(result);
  //     fs.writeFile("kml/xml2js.kml", xml, 'utf8', function (err) {
  //        if (err) return console.log(err);
  //     });


  //     //console.log(util.inspect(result, false, null))
  // });


  var newfile = originalfile;
  var arrayLength = files.length;
  for (var i = 0; i < arrayLength; i++) {
    //console.log(files[i]);

    //var pattern = /<a target="_blank" href="C:\\Users\\BRIAN_~1\\AppData\\Local\\Temp\\.*jpg">(.*)<\/a>/g
    // var pattern = /<a target="_blank" href="C:\\Users\\BRIAN_~1\\AppData\\Local\\Temp\\.*jpg">/g
    // newfile = newfile.replace(pattern, "$1");

    newfile = newfile.replace('">'+files[i], '"><a href="Photos/'+files[i].toLowerCase()+'"><img width="200" src="Photos/'+files[i].toLowerCase()+'" /></a><br>'+files[i]+'<br>');
    newfile = newfile.replace(''+files[i], '');
    //newfile = newfile.replace(files[i], 'ae <img width="200" src="Photos/'+files[i]+'" />');


  }

  fs.writeFile("kml/new.kml", newfile, 'utf8', function (err) {
     if (err) return console.log(err);
  });

});