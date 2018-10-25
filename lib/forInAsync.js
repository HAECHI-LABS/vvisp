module.exports = async function(object, logic) {
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      await logic(object[key], key);
    } else {
      throw new Error('no property');
    }
  }
};
