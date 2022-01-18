const withAuth = (req, res, next) => {
    if (!req.session.developer_id) {
      res.redirect("/login");
    } else {
      next();
    }
  };
  
  module.exports = withAuth;