
// VALIDATION DU MOT DE PASSE //

// SECURISER POUR LE MOT DE PASSE //

const passwordSchema = require('../models/password');


module.exports = (req,res, next) => {
    if(!passwordSchema.validate(req.body.password)){
        res.writeHead(400, '{"Vérifier votre mail ou votre mot de passe"}',{
            'content-type' : 'application/json'
        });
        res.end('Erreur dans votre mail ou votre mot de passe');
    }else{
     next();
     }
};