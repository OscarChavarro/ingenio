/**
Trae la lista de categorías del servidor.
*/
getTopLevelProductCategories = function() {
    Meteor.call("getRootProductCategoryId", null, function(error, response) {
        if ( valid(error) ) {
            console.log("Error llamando a getRootProductCategoryId");
        }
        else if ( valid(response) ) {
            var root = response;
            Session.set("rootProductCategoryId", root);
        }
        else {
            console.log("Respuesta de getRootProductCategoryId inválida");
        }
    });

    Meteor.call("getTopLevelProductCategories", null, function(error, response) {
        if ( valid(error) ) {
            console.log("Error llamando a getTopLevelProductCategories");
        }
        else if ( valid(response) ) {
            var topLevelProductCategoriesArray = response;
            Session.set("topLevelProductCategoriesArray", topLevelProductCategoriesArray);
        }
        else {
            console.log("Respuesta de getTopLevelProductCategories inválida");
        }
    });
}

/**
Cierra la sesión de usuario y limpia las variables de sesión relacionadas.
*/
globalLogout = function()
{
    Meteor.logout();
    Session.set("currentLoggedUsername", null);
    Session.set("currentUserRoles", null);
    Router.go("/");
}

/**
Dado un identificador de usuario y un rol (que debe venir de
la colección "userRole" en la base de datos Mongo), esta función
determina si el usuario contiene el rol indicado o no.
*/
globalCheckUserRole = function(uid, desiredRole)
{
    var roleArr = Session.get("currentUserRoles");

    if ( valid(uid) && !valid(roleArr) ) {
        Meteor.call("getUserRoles", uid, function(error, response) {
            if ( !valid(error) && valid(response)) {
                Session.set("currentUserRoles", response);
            }
        });
        return false;
    }
    else if ( valid(uid) && valid(roleArr) ) {
        var i;
        for ( i in roleArr ) {
            if ( roleArr[i] === desiredRole ) {
                return true;
            }
        }
        return false;
    }
    else if ( !valid(uid) ) {
        Session.set("currentUserRoles", null);
        return false;
    }
    return false;
}
