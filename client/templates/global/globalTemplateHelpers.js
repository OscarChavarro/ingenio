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
            if ( roleArr[i].nameC === desiredRole ) {
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

Template.registerHelper("globalCheckUserRole", function (desiredRole) 
{
    var uid = Meteor.userId();

    if ( !valid(uid) || !valid(desiredRole) ) {
        return false;
    }
    return globalCheckUserRole(uid, desiredRole);
});

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

/**                                                                                                                                                      
Esta operación calcula el nombre del usuario actualmente conectado.                                                                                      
Es global a todo el sistema.                                                                                                                             
*/
Template.registerHelper("globalGetCurrentLoggedUsername",
    function () {
        var uid = Meteor.userId();

        if ( !valid(uid) ) {
            return "<Anónimo(usuario no especificado)>";
        }

        var sessionUserName = Session.get("currentLoggedUsername");

        if ( valid(sessionUserName) ) {
            return sessionUserName;
        }

        var user = Meteor.users.findOne({_id:uid});
        if ( !valid(user) ) {
            return "<Anónimo(usuario con id=" + uid + " no encontrado en la base de datos)>";
        }
        if ( !valid(user.profile) ) {
            return "<Anónimo(usuario con id=" + uid + " en la base de datos pero sin perfil)>";
        }
        if ( !valid(user.profile.name) ) {
            return "<Anónimo(usuario con id=" + uid + " en la base de datos pero sin nombre)>";
        }

        Session.set("currentLoggedUsername", user.profile.name);

        return user.profile.name;
    }
);
