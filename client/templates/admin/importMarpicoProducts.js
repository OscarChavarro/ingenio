Router.route("/importMarpicoProducts", {
    name: "importMarpicoProducts"
});

Template.importMarpicoProducts.events({
	"click #importMarpicoProductsButton": function(event, template)
	{
        event.preventDefault();
        Meteor.call("importMarpicoProducts", null, function(error, response) {
        	if ( valid(error) || !valid(response) ) {
                alert("Error en proceso de imporación");
        	}
        	else {
        		alert("Listo el pollo");
        	}
        });
	}
});