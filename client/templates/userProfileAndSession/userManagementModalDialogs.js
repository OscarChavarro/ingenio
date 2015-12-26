Template.defineUserRegistrationModalDialog.events({
	/**
    Esta función se invoca cuando un usuario está llenando el formulario
    de registro. 

    PRE: El formulario está configurado con los campos "required" llenos.
	*/
	"submit #newUserRegisterForm": function(event, template)
	{
		event.preventDefault();

		console.log("PROCESANDO FORMULARIO DE REGISTRO:");

		var email = event.target.email.value;
		var password1 = event.target.password1.value;
		var password2 = event.target.password2.value;
		var name = event.target.name.value;
		var corporation = event.target.corporation.value;
		var phone = event.target.phone.value;
		var city = event.target.city.value;

        var newUser;
        newUser = {
        	email: email, 
        	password: password1, 
        	profile: { 
        		email: email, 
        		name: name,
        		corporation: corporation,
        		phone: phone,
        		city: city
        	}
        };

        Accounts.createUser(newUser, function(err) {
        	if ( valid(err) ) {
				if ( err.message === 'Email already exists. [403]' ) {
					alert("Este correo electrónico ya está siendo usado en el sistema");
				}
				else {
					alert("Error creando el perfil de usuario. Código de error: " + err.message + ".");
				}
			}
			else {
				console.log("El usuario ha sido creado!");
				/*
				var idRole = userRole.findOne({nameC:"CLIENT"})._id;
				u2r = {
				    userId: Meteor.userId(),
				    userRoleId: idRole
				};
				user2role.insert(u2r);
				*/
				$("#userRegistrationModalDialog").modal("hide");
				$("body").removeClass("modal-open");
				$(".userRegistrationModalDialog").remove();
				Router.go("/");
			}
        });

		$("#userRegistrationModalDialog").modal("hide");
		$("body").removeClass("modal-open");
		$(".userRegistrationModalDialog").remove();
	}
});

/**
Al finalizar la construcción del diálogo modal, se define una función
de validación de campos. En este momento sólo se verifica que los
campos no sean vacíos. Debe mejorarse para además asegurar que los
campos tienen datos válidos. Ver ejemplo actual de "tu correo está
vetado" para implementar las validaciones adicionales.
*/
Template.defineUserRegistrationModalDialog.onRendered(function()
{
	var elements = document.getElementsByTagName("INPUT");
	var i;
    for ( i = 0; i < elements.length; i++ ) {
    	console.log("  - " + elements[i].name);
    	
	    elements[i].oninvalid = function(e) {
	    	var msg = "Este campo es necesario";
	        e.target.setCustomValidity("");

	        switch ( e.target.name ) {
	            case "email":
	              msg = "Ingresa una dirección de correo válida";
            	  // Nótese que acá se puede procesar si el correo es válido
                  if ( e.target.name == "email" && e.target.value === "jedilink1@gmail.com" ) {
                      msg = "Tu correo está vetado";
                      e.target.setCustomValidity(msg);
              	      return;
                  }
	              break;
	            case "password1":
	              msg = "Ingresa una contraseña";
	              break;
	            case "password2":
	              msg = "Ingresa una contraseña de nuevo";
	              break;
	            case "name":
	              msg = "Tu nombre no puede ser vacío";
	              break;
	            case "corporation":
	              msg = "Entra el nombre de la empresa para la cual se realizará la cotización, o PARTICULAR si es para tí";
	              break;
	            case "city":
	              msg = "Tu ciudad no debe ser vacía";
	              break;
	            case "phone":
	              msg = "Ingresa tu número telefónico";
	              break;
	        }

	        if ( !e.target.validity.valid ) {
	            e.target.setCustomValidity(msg);
	        }
	    };
	    
	    elements[i].oninput = function(e) {
	        // Nótese que acá se puede procesar si el correo es válido
            if ( e.target.name == "email" && e.target.value === "jedilink1@gmail.com" ) {
                e.target.setCustomValidity("NO");
              	return;
            }
	        e.target.setCustomValidity("");
	    };
	}
});
