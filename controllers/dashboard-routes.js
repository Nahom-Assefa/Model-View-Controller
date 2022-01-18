const router = require("express").Router();
const { Post, Developer, Comment } = require("../models/associations");
const withAuth = require("../utils/auth");

router.get("/", withAuth, (req, res) => {
  Post.findAll({
    where: {
      id: req.session.developer_id,
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
  }).then((dbPostdata) => {
    const posts = dbPostdata.map((post) => post.get({ plain: true }));
    res.render("dashboard", { posts, loggedIn: true });
  });
});

router.get("/edit/:id", withAuth, (req, res) => {
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

    res.render("edit-post", {
      post,
      loggedIn: req.session.loggedIn,
    });
  });
});

module.exports = router;
