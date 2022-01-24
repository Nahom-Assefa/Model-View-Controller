const router = require("express").Router();
const { Post, Developer, Comment } = require("../../models/associations");

// GET /api/users
router.get("/", (req, res) => {
  Developer.findAll({
    attributes: { exclude: ["password"] },
  })
    .then((dbDeveloperData) => res.json(dbDeveloperData))
    .catch((err) => {
      res.status(500).json(err);
    });
});

// GET /api/users/1
router.get("/:id", (req, res) => {
  Developer.findOne({
    attributes: { exclude: ["password"] },
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Post,
        attributes: ["id", "title", "post_text", "created_at"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "created_at"],
        include: {
          model: Post,
          attributes: ["title"],
        },
      },
    ],
  })
    .then((dbDeveloperData) => {
      if (!dbDeveloperData) {
        res.status(404).json({ message: "No developer found with this id" });
        return;
      }
      res.json(dbDeveloperData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// POST /api/developers
router.post("/", (req, res) => {
  Developer.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
  .then((dbDeveloperData) => {
    console.log('line 57', dbDeveloperData);
        req.session.save(() => {
        req.session.developer_id = dbDeveloperData.id;
        req.session.username = dbDeveloperData.username;
        req.session.loggedIn = true;
        res.json(dbDeveloperData);
      })
      })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.post("/login", (req, res) => {
  Developer.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((dbDeveloperData) => {
      if (!dbDeveloperData) {
        res
          .status(400)
          .json({ message: "No developer with that email address!" });
        return;
      }

      const validPassword = dbDeveloperData.checkPassword(req.body.password);
      if (!validPassword) {
        res.status(400).json({ message: "Incorrect password!" });
        return;
      }

      req.session.save(() => {
        // declare session variables
        req.session.developer_id = dbDeveloperData.id;
        req.session.username = dbDeveloperData.username;
        req.session.loggedIn = true;

        res.json({ user: dbDeveloperData, message: "You are now logged in!" });
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// PUT /api/users/1
router.put("/:id", (req, res) => {
  Developer.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id,
    },
  })
    .then((dbDeveloperData) => {
      if (!dbDeveloperData[0]) {
        res.status(400).json({ message: "No developer found with this id" });
        return;
      }
      res.json(dbDeveloperData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete("/:id", (req, res) => {
  Developer.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbDeveloperData) => {
      if (!dbDeveloperData) {
        res.status(404).json({ message: "No developer found with this id" });
        return;
      }
      res.json(dbDeveloperData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
