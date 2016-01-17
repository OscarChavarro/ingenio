Router.route("/productSearch/:nameSpa", {
    name: "productSearch",
    loadingTemplate: "productSearchLoading",
    data: function () {
        return this.params.nameSpa;
    },
    waitOn: function () {
        return Meteor.subscribe("product") && Meteor.subscribe("product2category") && Meteor.subscribe("productCategory") && Meteor.subscribe("multimediaElement") && Meteor.subscribe("product2multimediaElement");
    }
});

Template.productSearch.helpers({
    //SE OBTIENEN TODOS LOS PRODUCTOS DE LA CATEGORIA ACTUAL
    getProductList: function () {
        console.log(Template.currentData());
        var search = new RegExp(Template.currentData(), 'i');
        var productList = product.find({ nameSpa: search }).fetch();
        console.log(productList);
        return productList;
    },
    //SE OBTIENE LA INFORMACION DE LA CATEGORIA ACTUAL
    getCurrentCategory: function () {
        return currentCategory = productCategory.findOne({ _id: Template.currentData() });
    },
    getImages: function (product) {
        //SE OBTIENEN LOS ELEMENTOS MULTIMEDIA CORRESPONDIENTE A CADA PRODUCTO
        var resources = [];
        var i = 0;
        if (typeof product != 'undefined') {
            product2multimediaElement.find({ productId: product._id }, { sort: { order: 1 }, limit: 1 }).forEach(function (element, index, array) {
                if (element.multimediaElementId) {
                    var multimedia = multimediaElement.findOne({ _id: element.multimediaElementId });
                    if (multimedia) {
                        if (multimedia.copies) {
                            if (multimedia.copies.multimediaElement) {
                                resources.push(multimedia);
                                resources[i].order = multimedia.order;
                                i++;
                            }
                        }
                    }
                }
            });
            return resources;
        }
    }
});