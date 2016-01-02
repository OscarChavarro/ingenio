Router.route('/requestPasswordReset', {
    name: 'requestPasswordReset',
    path: "/requestPasswordReset/:uid",
    loadingTemplate: "requestPasswordResetLoading",
    data: function() {
        uidGivenAtUrl = this.params.uid;
        datasetUsersFiltered = users.find({_id: uidGivenAtUrl}).fetch();
        Session.set("activeUser", datasetUsersFiltered);
        activeUserEmail = null;
    },
    waitOn: function() {
        var combine = {
            ready: function() {
                return Meteor.subscribe("allUsers");
            }
        };
        return combine;
    }
});

Template.requestPasswordReset.helpers({
    /**
    Retorna una de tres respuetas:
      - false: usuario no encontrado
      - "NEW": usuario nuevo
      - "EXISTING": usuario que ya estaba validado
    */
    getUserEmailGivenAtUrl: function() {
        var userSet = Session.get("activeUser");

        if ( !valid(userSet) || !valid(userSet.length) || userSet.length != 1 ) {
            return false;
        }

        var u = userSet[0];
        activeUserEmail = u.profile.email;

        if ( valid(u) && valid(u.profile) && valid(u.profile.validatedEmail) && u.profile.validatedEmail == true ) {
            return activeUserEmail;
        }

        return false;
    }
});

Template.requestPasswordReset.events({
    /**
    Debería mejorarse al implementar una política de seguridad para contraseñas.
    */
    "submit #passwordResetForm": function (event, template) {
        event.preventDefault();
        var p1 = event.target[0].value;
        var p2 = event.target[1].value;

        console.log("tuntun: [" + p1 + "]");

        if ( !valid(p1) || !valid(p2) || p1 !== p2 || p1 === "" ) {
            alert("ERROR: Verifique que las dos contraseñas sean iguales y no vacías");
            return;
        }

        var userSet = Session.get("activeUser");

        if ( !valid(userSet) || !valid(userSet.length) || userSet.length != 1 ) {
            console.log("Error: No hay un usuario seleccionado");
            return false;
        }

        var u = userSet[0];
        if ( !valid(u) || !valid(u._id) ) {
            console.log("Error: No hay un usuario seleccionado");
            return false;
        }

        console.log("  - Vamos a cambiar la clave para uid: " + u._id);
        Meteor.call("setUserPassword", u._id, p1, function(error, value){
            if ( valid(error) ) {
                alert("Error: RPC fallido");
            }
            else {
                Router.go("/");
                alert("Tu contraseña ha sido cambiada. Intenta por favor ingresar al sistema " +
                    "con tu nueva contraseña.");
            }
        });
    }
});
