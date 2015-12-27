//============================================================================
Router.route('/userRoleCreate', {
    name: 'userRoleCreate',
    loadingTemplate: "userRoleLoading",
    data: function() {
        datasetUserRoleFiltered = userRole.find();
    },
    waitOn: function() {
        return Meteor.subscribe("userRole");
    }
});

Router.route('/userRoleEditDelete', {
    name: 'userRoleEditDelete',
    loadingTemplate: "userRoleLoading",
    data: function() {
        datasetUserRoleFiltered = userRole.find();
    },
    waitOn: function() {
        return Meteor.subscribe("userRole");
    }
});

//============================================================================

Template.checkboxForUserRole.helpers({
    checkIfActive: function(u, r)
    {
        var filter = {userId: u, userRoleId: r};
        var check = user2role.findOne(filter);

        if ( valid(check) ) {
            return "checked";
        }
        return "unchecked";
    }
});

Template.showUserRoleIfActive.helpers({
    showIfActive: function(u, r)
    {
        var filter = {userId: u, userRoleId: r};
        var check = user2role.findOne(filter);
        var d = userRole.findOne({_id: r});

        if ( valid(check) ) {
            return "<li>" + d.nameC + "</li>";
        }
        return "";
    }
});

/*
Retorna acceso a la colección calculada en el Router.
*/
Template.userRoleCreate.helpers({
    dbUserRole: function() {
        return datasetUserRoleFiltered;
    }
});

/*
Retorna acceso a la colección calculada en el Router.
*/
Template.userRoleEditDelete.helpers({
    dbUserRole: function() {
        return datasetUserRoleFiltered;
    }
});

//============================================================================
Template.userRoleCreate.events({
    "submit .userRoleCreateForm": function (event) {
        var len = event.target.nameC.value;

        event.preventDefault();

        userRole.insert({
                nameC: len
        });
        
        event.target.nameC.value = "";

        return false;
    }
});

Template.editUserRole.events({
    "submit .userRoleDeleteForm": function (event) {
        userRole.remove(this._id);
        return false;
    }
});

/**
Este método utiliza una técnica basada en JSON para implementar
el patrón de diseño de reflection. Permite manipular la base 
de datos MongoDB para soportar la edición de formularios de
una manera general para todos los idiomas.

PRE: La forma desde donde se llame este método debe tener como
nombre el código de dos letras (la primera en mayúscula y
la segunda en minúscula) para identificar el idioma en el que
se muestra (por ejemplo "En" o "Es").
*/
Template.editUserRole.events({
    "submit .userRoleEditForm": function (event) {
        var len = event.target.userRoleName.value;        
        var langId = event.target["0"].form.name;
        
        var serialized = "{\"userRoleName" + langId + 
                "\":\"" + len + "\"}";
        var object = JSON.parse(serialized);
        userRole.update(this._id, {$set: object});
        
        return false;
    }
});
