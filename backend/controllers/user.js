const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };
  exports.login = (req, res, next) => {
    console.log(req);
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Paire identifiant/mot de passe incorrecte' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {            
            if (!valid) {
              return res.status(401).json({ error: 'Paire identifiant/mot de passe incorrecte !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id }, // les données à encoder , le payload
                'RANDOM_TOKEN_SECRET', // clé d'encodage plus longue en dev
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };