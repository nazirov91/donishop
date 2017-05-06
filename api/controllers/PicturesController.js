/**
 * PicturesController
 *
 * @description :: Server-side logic for managing pictures
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var sharp = require('sharp');
var fs = require('fs');

module.exports = {
  upload: function  (req, res) {
    req.file('file').upload({
      dirname: require('path').resolve(sails.config.appPath, 'assets/images')
    },function (err, files) {
      if (err)
        return res.serverError(err);

      // SHARP RESIZING
      // The following code takes the recently uploaded pictures, resize them into 3 different sizes
      // then stores the with _medium, _small endings in the same directory
      // files = [{fd: '/a/b.png'}, {fd: '/d/c.png'}]
      var imgLocation = files[0].fd.split('assets/').pop();
      var locationFileName = imgLocation.substring(0, imgLocation.indexOf('.'));
      var extension = imgLocation.split('.').pop();

      var imgIcon = locationFileName + '_icon.' + extension;
      var imgSmall = locationFileName + '_small.' + extension;
      var imgMedium = locationFileName + '_medium.' + extension;

      var input = 'assets/' + imgLocation;

      var outputIcon = 'assets/' + imgIcon;
      var outputSmall = 'assets/' + imgSmall;
      var outputMedium = 'assets/' + imgMedium;

      // Make an icon of the image
      sharp(input)
        .resize(85, 100)
        .jpeg({
          quality: 100
        })
        .toFile(outputIcon, function (err, info) {
          if (err) console.log(err);
          //console.log(info);
        });

      // Make a small copy of the image
      sharp(input)
        .resize(195, 243)
        .jpeg({
          quality: 100
        })
        .toFile(outputSmall, function (err, info) {
          if (err) console.log(err);
          //console.log(info);
        });

      // Make the medium copy
      sharp(input)
        .resize(270, 347)
        .jpeg({
          quality: 100
        })
        .toFile(outputMedium, function (err, info) {
          if (err) console.log(err);
          //console.log(info);
        });

      // Now we need to add the new file location to the files array
      // so that the function on the client side doesn't break
      files.push({
        fd: 'assets/' + imgIcon
      });
      files.push({
        fd: 'assets/' + imgSmall
      });
      files.push({
        fd: 'assets/' + imgMedium
      });

      return res.json({
        message: files.length + ' file(s) uploaded successfully!',
        files: files
      });
    });
  },
  del: function (req, res) {
    var extension = req.body.name.split('.').pop();
    var coreName = req.body.name.substring(0, req.body.name.indexOf('.'));
    var main  = req.body.name;
    var icon = coreName + '_icon.' + extension;
    var medium = coreName + '_medium.' + extension;
    var small = coreName + '_small.' + extension;

    var imageLocations = [main, icon, medium, small];

    deleteImg(imageLocations);

    function deleteImg(images) {
      for(var i = 0; i < images.length; i++){
        fs.unlink('assets/' + images[i], function (error) {
          if(error) res.serverError(error);
        });
      }
      res.send('Rasm o\'chirib tashlandi');
    }
  }
};

