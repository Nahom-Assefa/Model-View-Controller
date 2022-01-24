const router = require("express").Router();
const { Developer, Post, Comment } = require("../../models/associations");
const withAuth = require("../../utils/auth");

router.get("/", (req, res) => {
  Comment.findAll()
    .then((dbCommentData) => res.json(dbCommentData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  Comment.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["comment_text", "developer_id", "post_id", "created_at"],
    include: [
      {
        model: Developer,
        attributes: ["username"],
      },
      {
        model: Post,
        attributes: ["title"],
      },
    ],
  })
    .then((dbCommentData) => {
      if (!dbCommentData) {
        res.status(400).json({ message: "No comment associated with this id" });
      }
      res.json(dbCommentData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Make sure to put back the withAuth
router.put("/:id", (req, res) => {
  Comment.update(
    {
      comment_text: req.body.comment_text
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbCommentData) => {
      if (!dbCommentData) {
        res.status(400).json({ message: "No comment with this id to update" });
      }
      res.json(dbCommentData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  if (req.session) {
    Comment.create({
      comment_text: req.body.comment_text,
      post_id: req.body.post_id,
      developer_id: req.session.developer_id,
    })
      .then((commentData) => {
        res.json(commentData);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
});

router.delete("/:id", (req, res) => {
  Comment.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((commentData) => {
      if (!commentData) {
        res
          .status(404)
          .json({ message: "no comment has been found with this id" });
        return;
      }
      res.json(commentData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
