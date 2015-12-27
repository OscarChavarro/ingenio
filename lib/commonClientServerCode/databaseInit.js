//= VARIABLES GLOBALES ==============================================
// Acceso a colecciones de la base de datos (comunes a cliente y a servidor)

language = new Mongo.Collection("language");
users = Meteor.users; // Equivalente a new Mongo.Collection("users"); pero dentro del package Meteor.users

if ( Meteor.isClient ) {
    Session.set("globalSelectedLanguage", "Spa");
}

if ( Meteor.isServer ) {
    Meteor.users.allow({
        "update": function (userId, doc) {
            return true; 
        }
    });
    Meteor.users.allow({
        "remove": function (userId, doc) {
            return true; 
        }
    });
}
