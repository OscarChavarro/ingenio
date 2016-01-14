Router.route("/showProduct/:id", {
    name: "showProduct",
    loadingTemplate: "showProductLoading",
    data: function () {
        return this.params.id;
    },
    waitOn: function () {
        return Meteor.subscribe("product") && Meteor.subscribe("product2category") && Meteor.subscribe("productCategory") && Meteor.subscribe("supplier") && Meteor.subscribe("multimediaElement") && Meteor.subscribe("product2multimediaElement");
    }
});

Template.showProduct.helpers({
    //SE OBTIENE TODA LA INFORMACION DEL PRODUCTO
    getCurrent: function () {
        var productInfo = {};

        productInfo = product.findOne({ _id: Template.currentData() });
        productInfo.supplierId = supplier.findOne({ _id: productInfo.supplierId });

        //SE OBTIENEN LAS CATEGORIAS A LAS QUE PERTENECE EL PRODUCTO (PUEDEN SER VARIAS)
        productInfo.categories = [];
        var thisProduct2category = product2category.find({ productId: Template.currentData() }).fetch();
        thisProduct2category.forEach(function (element, index, array) {
            if (element.categoryId) {
                productInfo.categories.push(productCategory.findOne({ _id: element.categoryId }));
            }
        });
        console.log(productInfo);
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
