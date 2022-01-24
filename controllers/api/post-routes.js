const router = require("express").Router();
const { Post, Developer, Comment, Vote } = require("../../models/associations");
const withAuth = require("../../utils/auth");

router.get("/", (req, res) => {
  Post.findAll({
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
  })
    .then((dbPostData) => {
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", async (req, res) => {
  try {
    const response = await Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "title", "post_text", "created_at"],
      include: [
        {
          model: Developer,
          attributes: ["Username"],
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
    });
    if (!response) {
      res.status(400).json({ message: "No id found" });
    }
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
});

// make sure to put withAuth back in later and req.session.developer_id
router.post("/", (req, res) => {
  Post.create({
    title: req.body.title,
    post_text: req.body.post_text,
    developer_id: req.session.developer_id,
  })
    .then((dbPostData) => {
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// make sure to put withAuth back
router.put("/:id", async (req, res) => {
  try {
    const response = await Post.update(
      {
        title: req.body.title,
        post_text: req.body.post_text,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    if (!response) {
      res.status(400).json({ message: "No post to update with that id" });
    }
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
});

// remember to put withAuth back
router.delete("/:id", withAuth, (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
