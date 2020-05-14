module.exports = function (model) {
  this.addTag = async ({ id, tag }, cb) => {
    try {
      const dbObject = await model.findById(id).select("+tags");

      if (!dbObject) return cb({ message: "resource not found", status: 404 });

      const index = dbObject.tags.indexOf(tag);

      if (index > -1) return cb(null, { status: 200, updated: true });

      dbObject.tags.push(tag);
      await dbObject.save();
      cb(null, { status: 200, updated: true });
    } catch (error) {
      cb(error);
    }
  };

  this.findByTag = ({ tag }, cb) => {
    model
      .find({ tags: tag })
      .then((data) => {
        if (data) cb(null, { data, status: 200 });
        else cb({ message: "resource not found", status: 404 });
      })
      .catch((error) => cb(error));
  };

  this.removeTag = async ({ id, tag }, cb) => {
    try {
      const dbObject = await model.findById(id);
      if (!dbObject) return cb({ message: "resource not found", status: 404 });

      const index = dbObject.tags.indexOf(tag);

      if (index === -1) return cb(null, { status: 200, update: dbObject });

      dbObject.tags.splice(index, 1);
      const update = await dbObject.save();
      cb(null, { status: 200, update });
    } catch (error) {
      cb(error);
    }
  };
};
