
// AUTHORISATION POUR SE LOGER //

const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {

    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.HIDDEN_TOKEN);
      const userId = decodedToken.userId;
      if(req.body.userId && req.body.userId !== userId) {
          throw 'User ID non valable !';
      }else {
          next();
      }
    }catch(error) {
      res.status(400).json({ error: error | 'Non Reconnue !'})

    }

};