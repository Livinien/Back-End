
const Sauce = require('../models/sauces');
const fs = require('fs');



// CREER UNE SAUCE //

exports.createSauce = (req, res, next) => { 
  
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
  
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  
      likes: 0,
      dislikes: 0
      
    });


    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };
  


  // MODIFIER LA SAUCE //


  exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
  };




  // SUPPRIMER LA SAUCE //

  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {

          Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };




  // RECUPERER UNE SAUCE //

  exports.getOneSauce = (req, res, next) => {
  
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
  
  };



  // RECUPERER TOUTES LES SAUCES //

  exports.getAllSauces = (req, res, next) => {
    Sauce.find({})
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));

  };



  // AJOUTER LIKE / DISLIKE //
  
  exports.likes = (req, res, next) => {
  
    switch(req.body.like){
       
      case 0:
          Sauce.findOne({_id: req.params.id})
          .then((sauce) => {
            // Permet de reconnaitre si l'utilisateur à déjà mis un like //
              if(sauce.usersLiked.find(user => user === req.body.userId)){

                  Sauce.updateOne(
                    {_id: req.params.id}, {
                    //Inc : permet de rajouter une valeur à une donnée numérique. Cette valeur peut-être positive ou négative.
                    $inc: {likes: -1},
                    //Pull : permet de supprimer un élément
                    $pull : {usersLiked: req.body.userId}

                  })

                  .then(() => res.status(201).json({message: 'Yeah !'}))
                  .catch(error => res.status(500).json({error}));
              }
              

              
              
              //Voir si le bouton a été disliker ou non

              // Permet de reconnaitre si l'utilisateur à déjà mis un dislike //
              if (sauce.usersDisliked.find(user => user === req.body.userId)){

                  Sauce.updateOne(
                  { _id: req.params.id},{
                  $inc: {dislikes: -1},
                  $pull: { usersDisliked: req.body.userId}
              })
              .then(() => res.status(201).json({message: 'ça passe pas !'}))
              .catch(error => res.status(500).json({error}));
          }  console.log(req.body)
      })
    
      .catch(error => res.status(500).json({error}));
      break;



        //L'utilisateur clique sur le bouton "LIKE"

      case 1:
          Sauce.updateOne(
              {_id: req.params.id}, {
              $inc: { likes: 1},
              $push: {usersLiked: req.body.userId}
          })
          .then(()=> res.status(201).json({message: 'Love Sauce !'}))
          .catch(error => res.status(500).json({error}));
          break;



          //L'utilisateur cliquer sur le bouton "DISLIKE"

      case -1:
          Sauce.updateOne(
              { _id: req.params.id}, {
              $inc: { dislikes: 1},
              $push: { usersDisliked: req.body.userId}
          })
          .then(() => res.status(201).json({message: 'I hate this sauce !'}))
          .catch(error => res.status(500).json({error}));
          break;

      
  }
};





