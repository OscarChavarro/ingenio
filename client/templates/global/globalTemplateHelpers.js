/**
Versión helper global de la función resourceUrl definida en
/lib/commonClientServerCode/globalFunctions.js
*/
Template.registerHelper("resourceUrl", function(urlSegment)
    {
        return resourceUrl(urlSegment);
    }
);

/**
Cierra la sesión de usuario y limpia las variables de sesión relacionadas.
*/
globalLogout = function()
{
    Meteor.logout();
    Session.set("currentLoggedUsername", "<Anonymous>");
    Session.set("currentUserRoles", null);
    Router.go("/");
}

/**
Retorna true si hay una sesión de usuario activa.
*/
Template.registerHelper("globalIsUserLoggedIn", function () 
{
    var uid = Meteor.userId();
    
    if ( !valid(uid) ) {
        return false;
    }
    return true;
});
