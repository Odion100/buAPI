const { isValidObjectId } = require("mongoose");
module.exports = function (next) {
  if (this._conditions._id) {
    if (this._conditions._id.$in) {
      for (let i = 0; i < this._conditions_id.$in.length; i++) {
        if (!isValidObjectId(this._conditions._id.$in[i])) {
          return next({ message: "Invaild id type:", status: 400 });
        } else break;
      }
    } else if (!isValidObjectId(this._conditions._id))
      return next({ message: "Invaild id type:", status: 400 });
  }

  if (this._conditions.$and) {
    for (let i = 0; i < this._conditions.$and.length; i++) {
      const query = this._conditions.$and[i];
      if (query._id)
        if (query._id.$in) {
          for (let i = 0; i < query._id.$in.length; i++) {
            if (!isValidObjectId(query._id.$in[i])) {
              return next({ message: "Invaild id type:", status: 400 });
            } else break;
          }
        } else if (!isValidObjectId(query._id)) {
          return next({ message: "Invaild id type:", status: 400 });
        } else break;
    }
  }

  return next();
};
