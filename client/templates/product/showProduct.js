Router.route("/product/:friendlyUrl", {
    name: "showProduct",
    loadingTemplate: "showProductLoading",
    data: function () {
        // Variables globales a esta plantilla
        productFriendlyUrl = this.params.friendlyUrl

        // Retorno: deprecated.
        return this.params.friendlyUrl;
    }/*,
    waitOn: function () {
        return  Meteor.subscribe("product2multimediaElement") &&
                Meteor.subscribe("multimediaElement") && 
                Meteor.subscribe("product") &&
                Meteor.subscribe("product2user");
    }*/
});

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

        if ( valid(productInfo) ) {
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
                categories: []
            };
            Session.set(name, productInfo);

            // Obtener informacion de la base de datos de manera reactiva
            Meteor.call("getProductFromFriendlyUrl", productFriendlyUrl, function(e, v) {
                if ( valid(e) || !valid(v) || !valid(v.u) || !valid(v.p) ) {
                    var msg = "Error llamando al procedimiento remoto getProductFromFriendlyUrl";
                    if ( valid(v.s) ) {
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
        var products = product2user.find({ userId: Meteor.userId() }).fetch();
        if ( valid(products) ) {
            for (var i = 0; i < products.length; i++) {
                products[i].productId = product.findOne({ _id: products[i].productId });
            }
        } 
        else {
            return [];
        }
        return products;
    },
    isShoppingCartEmpty: function (ShoppingCart) {
        return !valid(ShoppingCart) || ShoppingCart.length <= 0
    },
    isProductInShoppingCart: function (currentProduct) {
        return (typeof product2user.findOne({ productId: currentProduct._id, userId: Meteor.userId() }) != "undefined");
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
    }
});

var loadImages = function(imgs)
{
    // Call to blueimp carousel functionality
    var carouselLinks = [];
    imgs.forEach(function (element, index, array) {
        carouselLinks.push({
            title: 'Título de la Imagen',
            href: element.u,
            type: 'image/jpeg',
            thumbnail: element.u,
            description: 'Descripción de la Imagen'
        });
    });

    if ( carouselLinks.length > 0 ) {
        var gallery = blueimp.Gallery(carouselLinks, {
            container: '#product-gallery',
            carousel: true,
            startSlideshow: true,
            fullScreen: false,
                
            //callback executed at gallery init, sets all thumbnails to invisible
            onopen: function () {
                var thumbnails = document.getElementsByClassName('indicator')[0].querySelectorAll('li');
                console.log(thumbnails);
                for (i = 0; i < thumbnails.length; i++) {
                    thumbnails[i].className = 'invisible';
                }
            }
        });
    }
}

Template.showProduct.onRendered(function () {
    // Get image list for product reactively
    var name = "imageSet_" + productFriendlyUrl;
    var imgs = Session.get(name);

    if ( valid(imgs) ) {
        loadImages(imgs);
    }
    else {
        Session.set(name, []);
        // First time, define data set
        Meteor.call("getProductImageSetFromFriendlyUrl", productFriendlyUrl, function(e, v) {
            if ( valid(e) || !valid(v) || !valid(v.u) || !valid(v.a) ) {
                var msg = "Error llamando al procedimiento remoto getProductImageSetFromFriendlyUrl.";
                if ( valid(v.s) ) {
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
