//============================================================================
Router.route("/languageCreate", {
    name: "languageCreate",
    loadingTemplate: "languageLoading",
    data: function () {
        datasetLanguageFiltered = language.find();
        return true;
    },
    waitOn: function() {
        languageHandle = Meteor.subscribe("language");
        return languageHandle;
    }
});

Router.route("/languageEditDelete", {
    name: "languageEditDelete",
    loadingTemplate: "languageLoading",
    data: function () {
        datasetLanguageFiltered = language.find();
        return true;
    },
    waitOn: function() {
        languageHandle = Meteor.subscribe("language");
        return languageHandle;
    }
});

//============================================================================

/*
Retorna acceso a la colección calculada en el Router.
*/
Template.languageEditDelete.helpers({
    dbLanguageFiltered: function() { 
        return datasetLanguageFiltered; 
    }
});

/*
Retorna acceso a la colección calculada en el Router.
*/
Template.languageCreate.helpers({
    dbLanguageFiltered: function() { 
        return datasetLanguageFiltered; 
    }
});

//============================================================================

Template.languageCreate.events({
    "submit .languageCreateForm": function (event) {
        event.preventDefault();

        var len = event.target.languageNameEng.value;
        var les = event.target.languageNameSpa.value;
        var lab = event.target.labelISO639_3.value;
        var lenabled = event.target.enabled.checked;

        language.insert({
            languageNameEng: len,
            languageNameSpa: les,
            labelISO639_3: lab,
            enabled: lenabled
        });

        event.target.languageNameEng.value = "";
        event.target.languageNameSpa.value = "";
        event.target.labelISO639_3.value = "";

        return false;
    }
});

Template.editLanguage.events({
    "submit .languageDeleteForm": function (event) {
        language.remove(this._id);
        return false;
    }
});

/**
Este método utiliza una técnica basada en JSON para implementar
el patrón de diseño de reflection. Permite manipular la base 
de datos MongoDB para soportar la edición de formularios de
una manera general para todos los idiomas.

PRE: La forma desde donde se llame este método debe tener como
nombre el código de tres letras (la primera en mayúscula y
las demás en minúscula) para identificar el idioma en el que
se muestra (por ejemplo "Eng" o "Spa") siguiendo el estándar
ISO639-3.
*/
Template.editLanguage.events({
    "submit .languageEditForm": function (event) {
        var len = event.target.languageName.value;    
        var languageId = event.target["0"].form.name;
        
        var serialized = "{\"languageName" + languageId + 
            "\":\"" + len + "\"}";
        var object = JSON.parse(serialized);
        language.update(this._id, {$set: object});
        
        return false;
    }
});

Template.editLanguage.events({
   "submit .languageCodeEditForm": function (event) {
        var len = event.target.label.value;    
        var codeStandard = event.target["0"].form.name;
        
        var serialized = "{\"label" + codeStandard + "\":\"" + len + "\"}";            
        var object = JSON.parse(serialized);
        language.update(this._id, {$set: object});

        return false;
    }
});

Template.editLanguage.events({
    "click input": function(event) {
        if ( event.target.checked ) {
            language.update(this._id, {$set: {enabled:true}});            
        }
        else {
            language.update(this._id, {$set: {enabled:false}});            
        }
    }
});

Template.editLanguage.helpers({
    languageEnabled: function () {
        var o = language.find(this._id).fetch();
        
        if ( o["0"].enabled == "true" ) {
            return "checked";
        }
        return "";
    }
});

Template.editLanguage.helpers({
    selectEditLanguageEs: function () {
        console.log("Cambiando a Spa");
        Session.set("globalSelectedEditLanguage", "Spa");
        return true;
    }
});

Template.editLanguage.helpers({
    selectEditLanguageEn: function () {
        console.log("Cambiando a Eng");
        Session.set("globalSelectedEditLanguage", "Eng");
        return true;
    }
});

