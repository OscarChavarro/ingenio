Template.headerBar.events({
	/**
    Esta función se llama cuando en la barra de navegación un usuario anónimo
    da click en el enlace de crear un nuevo usuario registrado.
	*/
	"click #registerNewUser": function(event, template)
	{
        event.preventDefault();
        $("#userRegistrationModalDialog").modal("show");
	}
});