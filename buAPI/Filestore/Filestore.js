const fs = require("fs-extra");
const moment = require("moment");
const mongo = require("mongojs");
const app = require("sht-tasks").app();
const obj = require("obj-handler");
const conf = require("../configurations");
const PORT = 7000;

const { ServiceFactory } = require("sht-tasks");
const FileStore = ServiceFactory();

FileStore.ServerModule("storage", function(server) {
  const storage = this;
  const StorageHandler = require("./components/StorageHandler")();

  storage.saveFiles = (opts, cb) => {
    if (!opts.files) {
      return cb({ message: "file upload unsuccessful" });
    }

    if (opts.dest) {
      opts.dest = opts.dest.substr(0, 1) === "/" ? opts.dest.substr(1) : opts.dest;
      opts.dest =
        opts.dest.substr(-1) === "/" ? opts.dest.substr(0, opts.dest.length - 1) : opts.dest;
      StorageHandler.save(opts, cb);
    } else {
      cb({ message: "invalid payload" });
    }
  };

  storage.deleteFiles = (fileTags, cb) => {
    if (!Array.isArray(fileTags)) {
      return cb({ message: "invalid payload", status: 400 });
    }

    if (fileTags[0].path) {
      StorageHandler.deleteFiles(fileTags, cb);
    } else {
      cb({ message: "invalid payload", status: 400 });
    }
  };

  storage.deleteFolder = (opts, cb) => {
    if (opts.dest) {
      opts.dest = opts.dest.substr(0, 1) === "/" ? opts.dest.substr(1) : opts.dest;
      opts.dest =
        opts.dest.substr(-1) === "/" ? opts.dest.substr(0, opts.dest.length - 1) : opts.dest;
      StorageHandler.deleteFolder(opts, cb);
    } else {
      cb({ message: "invalid payload" });
    }
  };

  storage.transferFiles = (opts, cb) => {
    if (!opts.dest || !Array.isArray(opts.fileTags)) {
      return cb({ message: "invalid payload  - expecting an Array" });
    }

    if (opts.fileTags[0].name && opts.fileTags[0].path) {
      opts.dest = opts.dest.substr(0, 1) === "/" ? opts.dest.substr(1) : opts.dest;
      opts.dest =
        opts.dest.substr(-1) === "/" ? opts.dest.substr(0, opts.dest.length - 1) : opts.dest;
      StorageHandler.transferFiles(opts, cb);
    } else {
      cb({ message: "invalid payload - expecting fileTag objects" });
    }
  };

  server.get("/storage/:dest/:file", (req, res) => {
    var path = __dirname + "/storage/" + req.params.dest + "/" + req.params.file;
    res.sendFile(path);
  });
});
