const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8)                                    // Minimum 8 lettres
.is().max(100)                                  // Maximum 100 lettres
.has().uppercase()                              // Doit avoir une majuscule
.has().lowercase()                              // Doit avoir une minuscule
.has().digits(2)                                // Doit avoir deux chiffres
.has().not().spaces()                           // Ne doit pas avoir d'espace
.is().not().oneOf(['Passw0rd', 'Password123']); // Valeurs sur liste de noir
 

module.exports = passwordSchema;