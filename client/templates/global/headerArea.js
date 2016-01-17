Template.headerArea.events({
    /**
    Esta función se llama cuando en la barra de navegación un usuario anónimo
    da click en el enlace de crear un nuevo usuario registrado.
    */
    "click #registerNewUser": function (event, template) {
        event.preventDefault();
        $("#userRegistrationModalDialog").modal("show");
    },
    /**
    Esta función se llama cuando un usuario registrado en sesión activa
    desea salir de la sesión.
    */
    "click #logoutUser": function (event, template) {
        event.preventDefault();
        globalLogout();
    },
    "submit .searhBarForm": function (event) {
        event.preventDefault();
        if (valid(event.target.searchBarName.value) && event.target.searchBarName.value.length > 0) {
            Router.go("/productSearch/" + event.target.searchBarName.value);
            $("#searchBarName").val("");
        }
    }
});
