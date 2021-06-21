
// SECURITE //

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const CryptoJS = require("crypto-js");



// ENREGISTREMENT D'UN UTILISATEUR //

exports.signup = (req, res, next) => {

    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        // Encodage de l'adresse mail pour le signup //
        const emailCryptoJs = CryptoJS.HmacSHA512(req.body.email, `${process.env.CRYPTO_TOKEN}`).toString();
        
        const user = new User({
            email: emailCryptoJs, 
            password: hash

        });

        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur crée !'}))
          .catch(error => res.status(400).json({ error }))
    })

    .catch(error => res.status(500).json({ error }));
};



// SE CONNECTER POUR LES UTILISATEURS DEJA INSCRITS //

exports.login = (req, res, next) => {

    // Encodage de l'adresse mail pour le login //
    const emailCryptoJs = CryptoJS.HmacSHA512(req.body.email, `${process.env.CRYPTO_TOKEN}`).toString();

    
    // POUR TROUVER L'UTILISATEUR //

    User.findOne({ email: emailCryptoJs })
      .then(user => {

        if (!user) {

            return res.status(401).json({ error: 'Utilisateur non trouvé !' });

        }

        // BCRYPT COMPARE LE MOT DE PASSE SUR MANGODB POUR COMPARER CELUI QUE ENTRE L'UTILISATEUR //

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