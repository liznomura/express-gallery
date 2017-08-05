/*jshint esversion:6*/
let register = function(Handlebars) {

  let helpers = {
    equals: function(req, res) {
      console.log('****REQ****', this);
      if(req.data.root.photos[0].dataValues.user_id !== user_id) { document.getElementByTagName('button').style.display = 'none'; }
    }
  };

  if (Handlebars && typeof Handlebars.registerHelper === "function") {
        // register helpers
        for (let prop in helpers) {
          Handlebars.registerHelper(prop, helpers[prop]);
        }
      } else {
        // just return helpers object if we can't register helpers here
        return helpers;
      }

    };

// client
if (typeof window !== "undefined") {
  register(Handlebars);
}
// server
else {
  module.exports.register = register;
  module.exports.helpers = register(null);
}