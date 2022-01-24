const router = require("express").Router();
const { Post, Developer, Comment } = require("../models/associations");
const withAuth = require("../utils/auth");

router.get("/", withAuth, (req, res) => {
  Post.findAll({
    where: {
      // use the ID from the session
      developer_id: req.session.developer_id,
    },
    attributes: [
      "id",
      "title",
      "post_text",
      "created_at",
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "developer_id", "created_at"],
        include: {
          model: Developer,
          attributes: ["username"],
        },
      },
      {
        model: Developer,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      // serialize data before passing to template
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      res.render("dashboard", { posts, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


router.get("/edit/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "post_text", "created_at"],
    include: [
      {
        model: Developer,
        attributes: ["username"],
      },
      {
        model: Comment,
        attributes: [
          "id",
          "comment_text",
          "developer_id",
          "post_id",
          "created_at",
        ],
        include: {
          model: Developer,
          attributes: ["username"],
        },
      },
    ],
  }).then((dbPostData) => {
    if (!dbPostData) {
      res.status(400).json({ message: "no post under this id" });
    }
    const post = dbPostData.get({ plain: true });

    console.log('line 69', post);

    res.render("edit-post", {
      post,
      loggedIn: req.session.loggedIn,
    });
  });
});

module.exports = router;
