Router.route("/product/:friendlyUrl", {
    name: "showProduct",
    loadingTemplate: "showProductLoading",
    data: function () {
        return this.params.friendlyUrl;
    },
    waitOn: function () {
        return Meteor.subscribe("product") && Meteor.subscribe("product2category") && Meteor.subscribe("productCategory") && Meteor.subscribe("supplier") && Meteor.subscribe("multimediaElement") && Meteor.subscribe("product2multimediaElement") && Meteor.subscribe("product2user");
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

Template.showProduct.helpers({
    //SE OBTIENE TODA LA INFORMACION DEL PRODUCTO
    getCurrent: function () {
        var productInfo = {};

        productInfo = product.findOne({ friendlyUrl: Template.currentData() });
        productInfo.supplierId = supplier.findOne({ _id: productInfo.supplierId });

        //SE OBTIENEN LAS CATEGORIAS A LAS QUE PERTENECE EL PRODUCTO (PUEDEN SER VARIAS)
        productInfo.categories = [];
        var thisProduct2category = product2category.find({ productId: productInfo._id }).fetch();
        thisProduct2category.forEach(function (element, index, array) {
            if (element.categoryId) {
                productInfo.categories.push(productCategory.findOne({ _id: element.categoryId }));
            }
        });
        //SE DEVUELVE LA INFORMACION DEL PRODUCTO
        return productInfo;
    },
    getImages: function (product) {
        //SE OBTIENEN LOS ELEMENTOS MULTIMEDIA CORRESPONDIENTE A CADA PRODUCTO
        var resources = [];
        var i = 0;
        if (typeof product != 'undefined') {
            product2multimediaElement.find({ productId: product._id }, { sort: { order: -1 }, limit: 8 }).forEach(function (element, index, array) {
                if (element.multimediaElementId) {
                    var multimedia = multimediaElement.findOne({ _id: element.multimediaElementId });
                    if (multimedia) {
                        if (multimedia.copies) {
                            if (multimedia.copies.multimediaElement) {
                                resources.push(multimedia);
                                resources[i].order = element.order;
                                i++;
                            }
                        }
                    }
                }
            });
        }
        return resources;
    },
    isFirstImage: function (image) {
        return (image.order == 1);
    },
    isLoggedIn: function () {
        return valid(Meteor.userId());
    },
    getShoppingCart: function () {
        var Productos = product2user.find({ userId: Meteor.userId() }).fetch();
        if (typeof Productos != "undefined") {
            for (var i = 0; i < Productos.length; i++) {
                Productos[i].productId = product.findOne({ _id: Productos[i].productId });
            }
        } else {
            return [];
        }
        return Productos;
    },
    isShoppingCartEmpty: function (ShoppingCart) {
        return !valid(ShoppingCart) || ShoppingCart.length <= 0
    },
    isProductInShoppingCart: function (currentProduct) {
        return (typeof product2user.findOne({ productId: currentProduct._id, userId: Meteor.userId() }) != "undefined");
    }
});

Template.showProduct.onRendered(function () {
    var datasetTest = product.findOne({ friendlyUrl: Template.currentData() });
    var i = 0;
    var producto2multimedia = product2multimediaElement.find({ productId: datasetTest._id });
    var imgs = [];
    producto2multimedia.forEach(function (element, index, array) {
        var img = multimediaElement.findOne({ _id: element.multimediaElementId });
        imgs.push(img);
    });
    datasetTest.resources = imgs;
    var carouselLinks = [];
    datasetTest.resources.forEach(function (element, index, array) {
        carouselLinks.push({
            title: 'Título de la Imagen',
            href: element.url(),
            type: 'image/jpeg',
            thumbnail: element.url(),
            description: 'Descripción de la Imagen'
        });
    });
    if (datasetTest.resources.length > 0) {
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
});
