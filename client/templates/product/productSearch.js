Router.route("/search", {
    name: "productSearch",
    loadingTemplate: "productSearchLoading",
    data: function () {
        return true;
    }
});

Template.productSearch.helpers({
    //SE OBTIENEN TODOS LOS PRODUCTOS DE LA CATEGORIA ACTUAL
    getProductList: function () {
        Session.set("isLoading", true);
        var filter = {};
        var filterCont = 0;
        if (valid(Router.current().params.query.name) && Router.current().params.query.name.length > 0) {
            filter.nameSpa = Router.current().params.query.name;
            filterCont++;
        }
        if (valid(Router.current().params.query.category) && Router.current().params.query.category.length > 0) {
            filter.category = Router.current().params.query.category;
            filterCont++;
        }
        if (valid(Router.current().params.query.quantity) && Router.current().params.query.quantity.length > 0) {
            filter["variantQuantitiesArr"] = { "$gt": parseInt(Router.current().params.query.quantity) };
            filterCont++;
        }
        if (valid(Router.current().params.query.price) && Router.current().params.query.price.length > 0) {
            var price = Router.current().params.query.price.split("-");
            if (price[1] != "x") {
                filter.price = { "$gt": parseInt(price[0]), "$lt": parseInt(price[1]) };
            } else {
                filter.price = { "$gt": parseInt(price[0]) };
            }
            filterCont++;
        }
        if (valid(Router.current().params.query.color) && Router.current().params.query.color.length > 0) {
            filter["variantDescriptionsArr"] = Router.current().params.query.color;
            filterCont++;
        }
        if (!valid(Session.get("productList")) && filterCont > 0) {
            Meteor.call("getProductList", filter, {}, function (err, result) {
                if (!valid(err)) {
                    Session.set("productList", result);
                }
                Session.set("isLoading", false);
            });
        } else {
            Session.set("isLoading", false);
        }
        return Session.get("productList");
    },
    areThereAnyProducts: function (list) {
        return (valid(list) ? list.length > 0 : false);
    },
    getProductCategoryList: function () {
        if (!valid(Session.get("categoryList"))) {
            Meteor.call("getProductCategoryList", function (err, result) {
                if (!valid(err)) {
                    Session.set("categoryList", result);
                }
            });
        }
        return Session.get("categoryList");
    },
    getImage: function (images) {
        return images[0];
    },
    isLoading: function (productList) {
        return Session.get("isLoading");
    }
});