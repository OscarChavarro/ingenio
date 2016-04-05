if (Meteor.isServer) {
    // Cuando se usa del lado del servidor requiere tener el paquete meteorhacks:npm y dentro de npm
    // los paquetes jquery, jsdom y xmlhttprequest.
    var jsdom = Meteor.npmRequire("jsdom");

    if (!valid(jsdom)) {
        console.log("ERROR: No se encuentra el módulo NPM jsdom");
    }
    else {
        var offlineWindow;
        offlineWindow = jsdom.jsdom().createWindow();

        if (!valid(offlineWindow)) {
            console.log("ERROR: Fallo en crear la ventana de trabajo fuera de linea para JSDOM/JQuery");
        }
        else if (process.env.HOSTNAME === "ingenio.cubestudio.co") {
            var jqueryPackage;
            jqueryPackage = Meteor.npmRequire("jquery");

            if (!valid(jqueryPackage)) {
                console.log("ERROR: No se puede instanciar jQuery");
            }
            else {
                $ = jqueryPackage(offlineWindow);
                if (valid($)) {
                    XMLHttpRequest = Meteor.npmRequire("xmlhttprequest").XMLHttpRequest;

                    $.support.cors = true;
                    $.ajaxSettings.xhr = function () {
                        return new XMLHttpRequest();
                    }
                }
            }

        };
    }
}

checkMandrillMailInfo = function () {
    // Verificación de acceso a la cuenta de mandrill
    var o = {
        "key": "mK0FrmuVJLqJIs-Vhq7X6A"
    };

    var xhr = $.ajax({
        type: 'POST',
        url: "https://mandrillapp.com/api/1.0/users/info.json",
        dataType: 'json',
        data: o
    });

    xhr.done(function (data) {
        console.log("SALIDA INFO");
        printObject(data);
    });

    xhr.fail(function (jqXHR, textStatus, errorThrown) {
        if (Meteor.isClient) {
            alert("ERROR LLAMANDO API MANDRILL INFO, VER CONSOLA");
        }
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
    });
}

/**
Esta función envía un correo usando el API Restful del servicio Mandrill.
*/
sendMandrillMail = function (recipients, subject, htmlContent, senderEmail, senderName) {
    var o;
    var xhr;

    console.log("ENVIANDO CORREO");

    o = {
        "key": "mK0FrmuVJLqJIs-Vhq7X6A",
        "message": {
            "html":
            htmlContent,
            "text": "Notificación del sistema INGENIO en TEXTO: Necesitas un lector de correo compatible con HTML para leer este mensaje.",
            "subject": subject,
            "from_email": senderEmail,
            "from_name": senderName,
            "to": recipients,
            "headers": {
                "Reply-To": senderEmail
            }

            /**
            Estas variables adicionales hacen que algunas no funcionen. Si se
            van a activar, hágalo con cuidado.
            */
            /*,
            "important": false,
            "track_opens": null,
            "track_clicks": null,
            "auto_text": null,
            "auto_html": null,
            "inline_css": null,
            "url_strip_qs": null,
            "preserve_recipients": null,
            "view_content_link": null,
            "bcc_address": "jedilink@gmail.com",
            "tracking_domain": null,
            "signing_domain": null,
            "return_path_domain": null,
            "merge": true,
            "merge_language": "mailchimp",
            "global_merge_vars": [
                {
                    "name": "merge1",
                    "content": "merge1 content"
                }
            ],
            "merge_vars": [
                {
                    "rcpt": "jedilink@gmail.com",
                    "vars": [
                        {
                            "name": "merge2",
                            "content": "merge2 content"
                        }
                    ]
                }
            ],
            "tags": [
                "password-resets"
            ],
            "subaccount": "customer-123",
            "google_analytics_domains": [
                "example.com"
            ],
            "google_analytics_campaign": "message.from_email@example.com",
            "metadata": {
                "website": "bogotasex.com"
            },
            "recipient_metadata": [
                {
                    "rcpt": "jedilink@gmail.com",
                    "values": {
                        "user_id": 123456
                    }
                }
            ],
            "attachments": [
                {
                    "type": "text/plain",
                    "name": "myfile.txt",
                    "content": "ZXhhbXBsZSBmaWxl"
                }
            ],
            "images": [
                {
                    "type": "image/png",
                    "name": "IMAGECID",
                    "content": "ZXhhbXBsZSBmaWxl"
                }
            ]*/
        },
        "async": false

        /** No están funcionando */
        //"ip_pool": "Main Pool"
        //"send_at": "2015-08-01 00:00:00"
    };

    if (valid($)) {
        xhr = $.ajax({
            type: 'POST',
            url: "https://mandrillapp.com/api/1.0/messages/send.json",
            dataType: 'json',
            data: o
        });

        xhr.done(function (data) {
            console.log("CORREO ENVIADO A LOS SIGUIENTES DESTINATARIOS");
            for (var i in data) {
                printObject(data[i]);
            }
        });

        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            if (Meteor.isClient) {
                alert("ERROR LLAMANDO API MANDRILL SEND, VER CONSOLA");
            }
            console.log("J: " + jqXHR);
            printObject(jqXHR);
            console.log("Status: " + textStatus);
            console.log("Error: " + errorThrown);
        });
    }
}
