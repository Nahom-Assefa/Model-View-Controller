const router = require("express").Router();
const { Post, Developer, Comment } = require("../../models/associations");
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
          attributes: ["username"]
        }
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
            attributes: ["username"]
          }
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

router.post("/", withAuth, (req, res) => {
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

router.put("/:id", withAuth, async (req, res) => {
  try {
    const response = await Post.update(
      {
        title: req.body.title,
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

router.delete("/:id", withAuth, async (req, res) => {
  try {
    const response = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!dbPostData) {
      res.status(400).json({ message: "No post to delete with that id" });
    }

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
