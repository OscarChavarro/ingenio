var sendPasswordResetEmail = function (uid, recipient) {
    var t = new Date();
    var subject = "Mensaje de reinicio de correo en el sistema Ingenio";
    var url = "http://ingenio.cubestudio.co/requestPasswordReset/" + uid;
    var htmlContent =
        '<html>' +
        '<body><table width="100%" border="0">' +
        '<tr><td bgcolor="#00aeef">' +
        '<img src="' + resourceUrlForMail("/images/ingenioHeaderLogo.png") + '">' +
        '</td></tr>' +
        '<tr><td>' +
        '<h1>¡Reinicio de contraseña en el sistema INGENIO!</h1>' +
        'Este es un correo que ha sido solicitado manualmente desde el sistema ' +
        '<b>INGENIO SOLUCIONES PUBLICITARIAS</b> ' +
        'en el instante de tiempo ' + t +
        '. Para realizar su cambio de contraseña siga el siguiente enlace: ' +
        '<b><a href="' + url + '">CAMBIO DE CONTRASEÑA</a></b>.' +
        '</td></tr>' +
        '</table></body>' +
        '</html>';
    var senderEmail = "ingenio@cubestudio.co";
    var senderName = "Ingenio Soluciones Publicitarias S.A.S.";

    sendMandrillMail([
        {
            "email": recipient,
            //"name": "",
            "type": "to"
        }
    ], subject, htmlContent, senderEmail, senderName);
}

var sendWelcomeAndRegistrationCodeEmail = function (uid, recipient, name) {
    var t = new Date();
    var subject = "Mensaje de bienvenida a Ingenio";
    var url = "http://ingenio.cubestudio.co/userAccess/" + uid;
    var htmlContent =
        '<html>' +
        '<body><table width="100%" border="0">' +
        '<tr><td bgcolor="#00aeef">' +
        '<img src="' + resourceUrlForMail("/images/ingenioHeaderLogo.png") + '">' +
        '</td></tr>' +
        '<tr><td>' +
        '<h1>¡Bienvenido(a) a INGENIO ' + name + ' !</h1>' +
        'Este correo es un recordatorio de la creación de tu cuenta de usuario en ' +
        '<b><a href="' + url + '">INGENIO SOLUCIONES PUBLICITARIAS</a></b>. ' +
        'Tu cuenta ha sido creada el instante de tiempo ' + t +
        'y para iniciar a usarla debes dar click en el enlace para ' +
        '<b><a href="' + url + '">ACTIVARLA</a></b>.' +
        '</td></tr>' +
        '</table></body>' +
        '</html>';
    var senderEmail = "ingenio@cubestudio.co";
    var senderName = "Ingenio Soluciones Publicitarias S.A.S.";

    sendMandrillMail([
        {
            "email": recipient,
            //"name": "",
            "type": "to"
        }
    ], subject, htmlContent, senderEmail, senderName);
}


Template.defineUserRegistrationModalDialog.events({
    /**
    Esta función se invoca cuando un usuario está llenando el formulario
    de registro. 

    PRE: El formulario está configurado con los campos "required" llenos.
    */
    "submit #newUserRegisterForm": function (event, template) {
        event.preventDefault();

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

        Accounts.createUser(newUser, function (err) {
            if (valid(err)) {
                if (err.message === 'Email already exists. [403]') {
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
                // El usuario no deberá ingresar sin haber verificado su correo
                sendWelcomeAndRegistrationCodeEmail(Meteor.userId(), email, name);

                globalLogout();
                $("#userRegistrationModalDialog").modal("hide");
                $("body").removeClass("modal-open");
                $(".userRegistrationModalDialog").remove();
                Router.go("/");
            }
        });

        $("#userRegistrationModalDialog").modal("hide");
        $("body").removeClass("modal-open");
        $(".userRegistrationModalDialog").remove();

        alert("Tu registro ha sido activado y ahora tienes un usuario en este sitio. Para poder usar " +
            "tu nueva cuenta, debes verificar el código que ha sido enviado a tu correo electrónico.");
    }
});

/**
Al finalizar la construcción del diálogo modal, se define una función
de validación de campos. En este momento sólo se verifica que los
campos no sean vacíos. Debe mejorarse para además asegurar que los
campos tienen datos válidos. Ver ejemplo actual de "tu correo está
vetado" para implementar las validaciones adicionales.
*/
Template.defineUserRegistrationModalDialog.onRendered(function () {
    var elements = document.getElementsByTagName("INPUT");
    var i;
    for (i = 0; i < elements.length; i++) {
        elements[i].oninvalid = function (e) {
            var msg = "Este campo es necesario";
            e.target.setCustomValidity("");

            switch (e.target.name) {
                case "email":
                    msg = "Ingresa una dirección de correo válida";
                    // Nótese que acá se puede procesar si el correo es válido
                    if (e.target.name == "email" && e.target.value === "jedilink1@gmail.com") {
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

            if (!e.target.validity.valid) {
                e.target.setCustomValidity(msg);
            }
        };

        elements[i].oninput = function (e) {
            // Nótese que acá se puede procesar si el correo es válido
            if (e.target.name == "email" && e.target.value === "jedilink1@gmail.com") {
                e.target.setCustomValidity("NO");
                return;
            }
            e.target.setCustomValidity("");
        };
    }
});

Template.userLoginBox.events({
    /**
    */
    "submit #loginUserForm": function (event, template) {
        event.preventDefault();
        var email = event.target.email.value;
        var password = event.target.password.value;

        Session.set("loginEmail", email);

        Meteor.loginWithPassword(email, password,
            function (error) {
                if (error) {
                    document.getElementById("emailToResetButtonArea").innerHTML =
                    '<button type="button" name="cancel" value="" class="btn btn-default" data-dismiss="modal"> ¡Cancelar ingreso! </button>';
                    document.getElementById("emailToResetFeedbackArea").innerHTML = "Buscando usuarios... ";
                    Meteor.call(
                        "testIfUserExistsByEmail",
                        Session.get("loginEmail"),
                        function (error, response) {
                            var userEmail = Session.get("loginEmail");
                            if (valid(error)) {
                                document.getElementById("emailToResetFeedbackArea").innerHTML =
                                'ERROR Buscando usuarios - llamado fallido a testIfUserExistsByEmail';
                            }
                            else if (valid(response) && response != false) {
                                Session.set("loginUid", response);
                                var validEmailMessage =
                                    'La cuenta de correo electrónico o la contraseña que has ingresado son ' +
                                    'incorrectas. Verifica tus datos y vuelve a intentarlo, o intenta reiniciar ' +
                                    'la contraseña si crees haberla olvidado.';
                                document.getElementById("emailToResetFeedbackArea").innerHTML = validEmailMessage;
                                document.getElementById("emailToResetButtonArea").innerHTML =
                                '<button type="button" name="cancel" value="" class="btn btn-default" data-dismiss="modal"> ¡Cancelar ingreso! </button>' +
                                '<input type="submit" name="resetPassword" value="¡Reiniciar contraseña!" class="btn btn-default">';
                            }
                            else {
                                document.getElementById("emailToResetFeedbackArea").innerHTML =
                                'El usuario ' + userEmail + ' no se encuentra registrado en el sistema. Revisa que tu dirección de correo esté bien escrita y sea la que registraste en este sistema.';
                            }
                        }
                        );
                    $("#wrongUserAccessModalDialog").modal("show");
                }
                else {
                    $('[data-toggle="dropdown"]').parent().removeClass("open");
                }
            }
            );
    }
});

Template.headerArea.events({
    /**
    Evento disparado tras una interacción dentro de loginUserForm. Dispara
    un llamado al diálogo de userResetFeedbackDialog. Sólo es posible llamar
    a esta función si la cuenta de correo en la variable de sesión "loginEmail"
    corresponde a un usuario registrado en el sistema (protección contra
    abusos de correo no solicitado - SPAM).
    */
    "submit #resetPasswordForm": function (event, template) {
        event.preventDefault();
        var email = Session.get("loginEmail");
        var uid = Session.get("loginUid");
        console.log("Voy a reiniciar una contraseña: " + email + " para el usuario " + uid);
        $("#wrongUserAccessModalDialog").modal("toggle");
        if (valid(email) && valid(uid)) {
            sendPasswordResetEmail(uid, email);
            $("#userPasswordResetFeedbackModalDialog").modal("show");
        }
    }
});
