//============================================================================
/**
*/
Router.route('/userEditDelete', {
    name: 'userEditDelete',
    loadingTemplate: "userLoading",
    data: function() {
        Meteor.subscribe("user2role");
        Meteor.subscribe("userRole");

        var options = {"sort" : [["createdAt", "asc"]]};
        datasetUsersFiltered = users.find({}, options);
        datasetUserRoleFiltered = userRole.find().fetch();
        Session.set("userRoles", datasetUserRoleFiltered);
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

//============================================================================
Template.editUser.helpers({
    /**
    Retorna acceso a la colección calculada en el Router.
    */
    dbUserRole: function() {
        var r = Session.get("userRole");
        if ( !valid(r) ) {
            r = userRole.find().fetch();
            Session.set("userRoles", r);
        }
        return r;
    },
    /**
    This es un user
    */
    formatDate: function()
    {
        var i;
        var d = this.createdAt;
        var months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

        if ( !valid(d) ) {
            return "<indefinida>";
        }

        return "" + months[d.getMonth()] + ". " + d.getDate() + " de " + d.getFullYear() + ", " + 
            d.getHours() + ":" + d.getMinutes();
    }
});

Template.userEditDelete.helpers({
    /**
    Retorna acceso a la colección calculada en el Router.
    */
    dbUsers: function() {
        var array = datasetUsersFiltered.fetch();
        var i;
        var counter = 1;

        for ( i in array ) {
            array[i].i = counter;
            counter++;
        }

        return array;
    }
});

//============================================================================

Template.editUser.events({
    /**
    Elimina un usuario de la base de datos. Requiere que la restricción de 
    "remove" en la base de datos para la colección users se desactive.
    */
    "submit .userDeleteForm": function (event) {
        event.preventDefault();

        console.log("Trato de borrar un usuario");
        var uid = event.target.deleteUser.id;

        if ( !valid(uid) ) {
            console.log("  - ERROR: Usuario inválido");
            return false;
        }

        // Borrar las asociaciones de user2role
        var u2r = user2role.find({userId: uid});
        if ( valid(u2r) ) {
            var arr = u2r.fetch();
            var i;
            for ( i in arr ) {
                var u2rid = arr[i]._id;
                user2role.remove({_id: u2rid});
            }
        }

        // Borrar usuario
        Meteor.users.remove({_id:uid}) 


        return false;
    },
    /**
    Cambia el nombre del usuario en la base de datos.
    */
    "submit .userNameEditForm": function (event) {
        event.preventDefault();
        var un = event.target.userName.value;  
        var uid = event.target.userName.id;
        var object = {"profile.name": un};
        Meteor.users.update(uid, {$set: object});
        return false;
    },
    /**
    Cambia la contraseña del usuario.
    */
    "submit .passwordEditForm": function (event) {
        event.preventDefault();
                var p = event.target.password.value;    
                var uid = event.target.password.id;
                Meteor.call("setUserPassword", uid, p);
        return false;
    },
    /**
    Evento de cambio de estado para uno de los roles
    */
    "click input": function(event, template) {
        var roleId = event.target.id;

        var form = event.target.form;
        if ( !valid(form) ) {
            return false;
        }

        var userId = $(form).attr("id");

        if ( !valid(userId) || !valid(roleId) ) {
            return false;
        }

        var state = false;

        if ( event.target.checked ) {
            state = true;
        }

        var filter = {userId: userId, userRoleId: roleId};
        var pair = user2role.findOne(filter);

        if ( !valid(pair) ) {
            if ( state ) {
                user2role.insert(filter);
            }
        }
        else {
            if ( !state ) {
                user2role.remove(pair._id);
            }
        }
    }
});
