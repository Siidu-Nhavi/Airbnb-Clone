module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.isAlreadyLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash("success", "You are already logged in");
    return res.redirect("/listings");
  }
  next();
};

//Note: Cannot set headers after they are sent 
// here i initially make mistake after flashing succes or failure message i directly redirected to listings that is not right way to do that cause it leads our server crash . it is important to avoid.