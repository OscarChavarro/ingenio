Router.route("/product/:friendlyUrl", {
    name: "showProduct",
    loadingTemplate: "showProductLoading",
    data: function () {
        return this.params.friendlyUrl;
    },
    waitOn: function () {
        return Meteor.subscribe("product") && Meteor.subscribe("product2category") && Meteor.subscribe("productCategory") && Meteor.subscribe("supplier") && Meteor.subscribe("multimediaElement") && Meteor.subscribe("product2multimediaElement");
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
