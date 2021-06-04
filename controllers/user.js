const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const MaskData = require('maskdata');


exports.signup = (req, res, next) => {

    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const emailMask2Options = {
            maskWith: "*", 
            unmaskedStartCharactersBeforeAt: 0,
            unmaskedEndCharactersAfterAt: 0,
            maskAtTheRate: false
        };

        const checkMail= MaskData.maskEmail2(req.body.email,emailMask2Options);
        
        const user = new User({
            email: checkMail, 
            password: hash

        });

        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur crée !'}))
          .catch(error => res.status(400).json({ error }))
    })

    .catch(error => res.status(500).json({ error }));
};



exports.login = (req, res, next) => {

    const emailMask2Options = {
        maskWith: "*", 
        unmaskedStartCharactersBeforeAt: 0,
        unmaskedEndCharactersAfterAt: 0,
        maskAtTheRate: false
    };

    const checkMail = MaskData.maskEmail2(req.body.email, emailMask2Options);

    User.findOne({ email: checkMail })
      .then(user => {

        if (!user) {

            return res.status(401).json({ error: 'Utilisateur non trouvé !' });

        }

        bcrypt.compare(req.body.password, user.password)
           .then(valid => {

            

                if(!valid) {

                    return res.status(401).json({ error: 'Mot de Passe Incorrect !' });

                }
                res.status(200).json ({
                    userId: user._id,
                    token: jwt.sign(
                     { userId: user._id },
                     process.env.HIDDEN_TOKEN,
                     { expiresIn: '24h'}
                    )

                });
           })
           .catch(error => res.status(500).json({ error }))

      })

      .catch(error => res.status(500).json({ error }))
};