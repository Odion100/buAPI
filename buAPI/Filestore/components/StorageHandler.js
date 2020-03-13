module.exports = function storageHandler() {
  const storageHandler = this;

  storageHandler.save = (opts, cb) => {
    var fileTags = [];
    var _dest = __dirname + "/storage/" + opts.dest;

    fs.ensureDir(_dest, err => {
      if (err) {
        return cb(err);
      }

      obj(opts.files).forEachSync((file, index, next, last) => {
        fs.copy(file.path, _dest + "/" + file.originalname, err => {
          if (err) {
            return cb(err);
          }

          fileTags.push({
            name: file.originalname,
            dest: "/" + opts.dest,
            path: "/storage/" + opts.dest + "/" + file.originalname,
            url:
              "http://" + conf.HOST + ":" + PORT + "/storage/" + opts.dest + "/" + file.originalname
          });

          if (last) {
            cb(null, fileTags);
          } else {
            next();
          }
        });
      });
    });
  };

  storageHandler.deleteFiles = (fileTags, cb) => {
    var files_deleted = 0;
    var files_not_found = 0;

    obj(fileTags).forEachSync((fileTag, index, next, last) => {
      if (fs.existsSync(__dirname + fileTag.path)) {
        fs.unlinkSync(__dirname + fileTag.path);
        files_deleted++;
      } else {
        files_not_found++;
      }

      if (last) {
        cb(null, { files_deleted, files_not_found });
      } else {
        next();
      }
    });
  };

  storageHandler.deleteFolder = (opts, cb) => {
    path = __dirname + "/storage/" + opts.dest;
    if (fs.existsSync(path)) {
      deleteFilesRecursive(path);
      cb();
    } else {
      cb({ message: "folder not found" });
    }

    function deleteFilesRecursive(_dest) {
      fs.readdirSync(_dest).forEach(function(file, index) {
        var currPath = _dest + "/" + file;
        if (fs.lstatSync(currPath).isDirectory()) {
          // recurse
          deleteFilesRecursive(currPath);
        } else {
          // delete file
          fs.unlinkSync(currPath);
        }
      });

      fs.rmdirSync(path);
    }
  };

  storageHandler.transferFiles = (opts, cb) => {
    const _dest = __dirname + "/storage/" + opts.dest;

    fs.ensureDir(_dest, err => {
      if (err) {
        return cb(err);
      }

      var newFileTags = [];

      obj(opts.fileTags).forEachSync((fileTag, index, next, last) => {
        var oldPath = __dirname + fileTag.path;
        var newPath = _dest + "/" + fileTag.name;
        fs.copy(oldPath, newPath, err => {
          if (err) {
            return cb(err);
          }

          newFileTags.push({
            name: fileTag.name,
            dest: "/" + opts.dest,
            path: "/storage/" + opts.dest + "/" + fileTag.name,
            url: "http://" + conf.HOST + ":" + PORT + "/storage/" + opts.dest + "/" + fileTag.name
          });

          if (last) {
            cb(null, newFileTags);
          } else {
            next();
          }
          if (opts.delete) {
            fs.unlinkSync(oldPath);
          }
        });
      });
    });
  };
};
