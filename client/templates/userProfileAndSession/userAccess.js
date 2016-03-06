//============================================================================

activeUserEmail = null;

Router.route('/userAccess', {
    name: 'userAccess',
    path: "/userAccess/:uid",
    loadingTemplate: "userAccessLoading",
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

Template.userAccess.helpers({
    /**
    Retorna una de tres respuetas:
      - false: usuario no encontrado
      - "NEW": usuario nuevo
      - "EXISTING": usuario que ya estaba validado
    */
    getUidGivenAtUrl: function() {
        var userSet = Session.get("activeUser");

        if ( !valid(userSet) || !valid(userSet.length) || userSet.length != 1 ) {
            return false;
        }

        var u = userSet[0];
        activeUserEmail = u.profile.email;

        if ( valid(u) && valid(u.profile) && valid(u.profile.validatedEmail) && u.profile.validatedEmail == true ) {
            Router.go("/");
            return "EXISTING";
        }

        console.log("Nuevo usuario validado!");
        users.update(u._id, {$set: {"profile.validatedEmail": true}});

        document.getElementById("welcomeemail").innerHTML = activeUserEmail;
        $("#userActiveModalDialog").modal("show");
        Router.go("/");

        return "NEW";
    }
});

Template.defineWelcomeDialog.events({
    "submit #login": function(event, template) {
        event.preventDefault();
        var email = activeUserEmail;
        var password = event.target.password.value;

        console.log("email: [" + email + "]");
        console.log("clave: [" + password + "]");

        Meteor.loginWithPassword(email, password,
            function(error)
            {
                if ( error ) {
                    alert("Error en acceso: " + error);
                    //$("#...ModalDialog").modal("show");
                }
                else {
                    $("#userActiveModalDialog").modal("toggle");
                }
            }
        );
    }
});
