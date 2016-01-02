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
