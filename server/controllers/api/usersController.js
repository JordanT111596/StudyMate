const usersController = require('express').Router();

const db = require('../../models');
const { JWTVerifier } = require('../../lib/passport');
const jwt = require('jsonwebtoken');

usersController.post('/', (req, res) => {
  const { email, password } = req.body;

  db.User.create({ email, password })
    .then(user => res.json(user))
    .catch(err => res.json(err));
});

usersController.get('/me', JWTVerifier, (req, res) => {
  res.json(req.user);
});

usersController.get('/:UserId', (req, res) => {
  db.User.findOne({ where: { id: req.params.UserId } }).then(results => res.json(results));
})
usersController.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.User.findOne({ where: { email } })
    .then(user => {
      if (!user || !user.comparePassword(password)) {
        return res.status(401).send("Unauthorized");
      }

      res.json({
        token: jwt.sign({ sub: user.id }, process.env.JWT_SECRET),
        user
      });
    });
});

usersController.put('/', JWTVerifier, (req, res) => {
  const { username, is_tutor, timezone, user_bio, selectedSubjects } = req.body;
  db.User.update({
    username,
    is_tutor,
    timezone,
    user_bio
  }, { where: { id: req.user.id } }
  ).then(() => {
    return db.User.findOne({
      where: { id: req.user.id }
    })
      .then(result => {
        selectedSubjects.forEach(element => {
          result.setSubjects(parseInt(element));
        });
      })
  }).then(() => {
    res.sendStatus(200);
  }).catch(err => {
    res.sendStatus(500);
  });
})

module.exports = usersController;
