Router.route("/product/:friendlyUrl", {
    name: "showProduct",
    loadingTemplate: "showProductLoading",
    data: function () {
        // Variables globales a esta plantilla
        productFriendlyUrl = this.params.friendlyUrl

        // Retorno: deprecated.
        return this.params.friendlyUrl;
    },
    waitOn: function () {
        /*return  Meteor.subscribe("product2multimediaElement") &&
                Meteor.subscribe("multimediaElement") && 
                Meteor.subscribe("product") &&
                Meteor.subscribe("product2user", Meteor.userId());*/
    },
    onAfterAction: function () {
        Session.set("productAdded", undefined);
    }
});

var sendQuotationList = function (productList) {
    var t = new Date();
    var subject = "Cotización desde el Sistema Automatizado de Ingenio";
    var htmlContent = "<html><body><p>A continuación está la lista de cotización correspondiente al cliente " + Meteor.user().profile.name + " a nombre de la empresa " + Meteor.user().profile.corporation + "</p>";
    htmlContent += "<table style='width:100%;'><tr style='color:white;background-color:blue;'><td>Item</td><td>Nombre</td><td>Cant.</td><td>Precio unid.</td><td>Valor total antes de iva</td><tr>"
    for (var i = 0; i < productList.length; i++) {
        htmlContent += "<tr><td>" + productList[i].productId.supplierReference + "</td><td>" + productList[i].productId.nameSpa + "</td><td>" + productList[i].quantity + "</td><td>" + productList[i].productId.price + "</td><td>" + (parseFloat(productList[i].productId.price) * parseInt(productList[i].quantity)) + "</td><tr>";
    }
    htmlContent += "</table></body></html>";
    var senderEmail = "ingenio@cubestudio.co";
    var senderName = "Ingenio Soluciones Publicitarias S.A.S.";

    sendMandrillMail([
        {
            "email": Meteor.user().profile.email,
            //"name": "",
            "type": "to"
        }, {
            "email": "jedilink@gmail.com",
            //"name": "",
            "type": "to"
        }
    ], subject, htmlContent, senderEmail, senderName);
}

Template.showProduct.helpers({
    /**
    Retorna un objeto que contiene informacion del producto especificado en la URL amistosa,
    con un arreglo de categorias agregado como un arreglo en el atributo "categories".
    PRE: Template.currentData() contiene la URL amigable de un producto.
    */
    getCurrent: function () {
        var productInfo;
        var name = "product_" + productFriendlyUrl;
        var productInfo = Session.get(name);

        if (valid(productInfo)) {
            return productInfo;
        }
        else {
            // Valor vacio
            productInfo = {
                _id: "000000000000000000000000",
                nameSpa: "Producto cargando de la base de datos",
                supplierId: "000000000000000000000000",
                supplierReference: "PENDING_FROM_DB",
                internalIngenioReference: "0000",
                descriptionSpa: "La informacion del producto solicitado se esta cargando a partir de la base de datos.",
                price: 666,
                friendlyUrl: Template.currentData(),
                marPicoProductId: 0,
                categories: [],
                measures: "Medidas cargando de la base de datos",
                printAreaSpa: "Área de impresión cargando de la base de datos",
                packingSpa: "Empaque cargando de la base de datos",
                markingSupportedSpa: "Marcado soportado cargando de la base de datos"
            };
            Session.set(name, productInfo);

            // Obtener informacion de la base de datos de manera reactiva
            Meteor.call("getProductFromFriendlyUrl", productFriendlyUrl, function (e, v) {
                if (valid(e) || !valid(v) || !valid(v.u) || !valid(v.p)) {
                    var msg = "Error llamando al procedimiento remoto getProductFromFriendlyUrl";
                    if (valid(v.s)) {
                        msg = msg + v.s;
                    }
                    console.log(msg);
                }
                else {
                    var n = "product_" + v.u;
                    Session.set(n, v.p);
                }
            });
        }

        return productInfo;
    },
    /*isFirstImage: function (image) {
        return (image.order == 1);
    },*/
    isLoggedIn: function () {
        return valid(Meteor.userId());
    },
    getShoppingCart: function () {
        if (!valid(Session.get("shoppingCart"))) {
            Meteor.call("getShoppingCart", Meteor.userId(), function (err, result) {
                if (!valid(err)) {
                    Session.set("shoppingCart", result);
                } else {
                    Session.set("shoppingCart", []);
                }
            });
        }
        return Session.get("shoppingCart");
    },
    isShoppingCartEmpty: function (ShoppingCart) {
        if (valid(ShoppingCart)) {
            if (ShoppingCart.length > 0) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    },
    isProductInShoppingCart: function (currentProduct) {
        if (!valid(Session.get("productAdded"))) {
            Meteor.call("isProductInShoppingCart", currentProduct, function (err, result) {
                if (!valid(err)) {
                    Session.set("productAdded", result);
                } else {
                    Session.set("productAdded", true);
                }
            });
        }
        return Session.get("productAdded");
    },
    getSubtotal: function (price, quantity) {
        return (parseFloat(price) * parseInt(quantity));
    },
    isLoading: function (object) {
        return !valid(object);
    },
    isShoppingCartLoading: function () {
        return !valid(Session.get("shoppingCart"));
    }
});

Template.showProduct.events({
    "keyup .cart-amount": function (event, template) {
        event.preventDefault();
        event.target.style.color = "#000000";
        if (!valid(event.target.dataset.id)) {
            event.target.style.color = "#ff0000";
            return false;
        }
        if (!valid(event.target.value) || isNaN(event.target.value) || event.target.value.length <= 0) {
            event.target.style.color = "#ff0000";
            return false;
        }
        product2user.update(event.target.dataset.id, { $set: { quantity: event.target.value.trim() } });
    },
    "submit .add-product": function (event, template) {
        event.preventDefault();
        if (!valid(event.target.productId.value)) {
            alert("Ocurrió un error inesperado. Por favor refresque la página e intente de nuevo");
            return false;
        }
        if (!valid(event.target.productPrice.value)) {
            alert("Ocurrió un error inesperado. Por favor refresque la página e intente de nuevo");
            return false;
        }
        if (!valid(Meteor.userId())) {
            alert("Debe haber iniciado sesión para realizar esta acción.");
            return false;
        }
        if (!valid(event.target.quantity.value) || isNaN(event.target.quantity.value) || event.target.quantity.value.length <= 0) {
            alert("La cantidad a cotizar ingresada es inválida.");
            return false;
        }

        product2user.insert({
            userId: Meteor.userId(),
            productId: event.target.productId.value.trim(),
            quantity: event.target.quantity.value
        });

        alert("El producto se ha agregado a la lista de cotización satisfactoriamente.");
        Session.set("shoppingCart", undefined);
        Session.set("productAdded", true);
    },
    "click #generar-solicitud": function (event, template) {
        var products = Session.get("shoppingCart");
        if (valid(Meteor.user())) {
            if (valid(products)) {
                Meteor.call("deleteShoppingCart", function (err, result) {
                    if (!valid(err) && result) {
                        sendQuotationList(products);
                        alert("Cotización enviada con éxito.");
                        Session.set("productAdded", false);
                        Session.set("shoppingCart", undefined);
                    } else {
                        alert("Ocurrió un error enviando la cotización. Por favor inténtelo de nuevo más tarde.");
                    }
                });
            } else {
                alert("No ha registrado ningún producto para cotizar.");
            }
        } else {
            alert("Debe haber iniciado sesión para realizar esta acción.");
        }
    }
});

var loadImages = function (imgs) {
    $("#photo-gallery").html("")

    if (imgs.length > 0) {
        var galleries = $('.ad-gallery').adGallery({
            slideshow: {
                enable: true,
                autostart: true,
                speed: 5000,
                start_label: 'Iniciar',
                stop_label: 'Detener',
                // Should the slideshow stop if the user scrolls the thumb list?
                stop_on_scroll: true, 
                // Wrap around the countdown
                countdown_prefix: '(',
                countdown_sufix: ')',
                onStart: function () {
                    // Do something wild when the slideshow starts
                },
                onStop: function () {
                    // Do something wild when the slideshow stops
                }
            },
            // or 'slide-vert', 'resize', 'fade', 'none' or false
            effect: 'slide-hori', 
            // Move to next/previous image with keyboard arrows?
            enable_keyboard_move: true, 
            // If set to false, you can't go from the last image to the first, and vice versa
            cycle: true
        });
        console.log(galleries);
    }
    $(".ad-loader").remove();
    imgs.forEach(function (element, index, array) {
        galleries[0].addImage("/resized/resized_128/" + element.u, "/original/productImages/" + element.u);
    });
    $(galleries[0].next_link[0]).click();
}

Template.showProduct.onRendered(function () {
    // Get image list for product reactively
    var name = "imageSet_" + productFriendlyUrl;
    var imgs = Session.get(name);

    if (valid(imgs)) {
        loadImages(imgs);
    }
    else {
        Session.set(name, []);
        // First time, define data set
        Meteor.call("getProductImageSetFromFriendlyUrl", productFriendlyUrl, function (e, v) {
            if (valid(e) || !valid(v) || !valid(v.u) || !valid(v.a)) {
                var msg = "Error llamando al procedimiento remoto getProductImageSetFromFriendlyUrl.";
                if (valid(v.s)) {
                    msg = msg + " " + v.s;
                }
                console.log(msg);
            }
            else {
                var n = "imageSet_" + v.u;
                Session.set(n, v.a);
                loadImages(v.a);
            }
        });
    }
});
