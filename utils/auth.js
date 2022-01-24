const withAuth = (req, res, next) => {
    if (!req.session.developer_id) {
      // alert('Please check you are logged in to enable that functionality!');
      res.redirect("/login");
    } else {
      next();
    }
  };
  
  module.exports = withAuth;