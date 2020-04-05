module.exports = constants =>
  function(next) {
    const update = this.getUpdate();
    if (!update.$set) throw { message: "Internal Error: Expected update to use $set" };

    constants.forEach(field => {
      if (update.$set[field]) {
        throw { message: `${field} field modification not allowed`, status: 403 };
      }
    });
    next();
  };
