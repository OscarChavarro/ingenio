Router.route("/manageProductCategory", {
    name: "manageProductCategory",
    loadingTemplate: "manageProductCategoryLoading",
    data: function() {
        productCategoryFiltered = productCategory.find();
    },
    waitOn: function() {
        return Meteor.subscribe("productCategory");
    }
});

Template.manageProductCategory.helpers({
    dbProductCategory: function()
    {
        return productCategoryFiltered;
    }
});

Template.manageProductCategory.events({
    "submit #addNewProductCategoryForm": function(event, template) {
        event.preventDefault();
        console.log("tun tururuntun");
    }
});
