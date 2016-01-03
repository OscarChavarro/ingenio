Router.route("/manageProductCategory", {
    name: "manageProductCategory",
    loadingTemplate: "manageProductCategoryLoading",
    data: function() {
        var options =  {"sort" : [["nameSpa", "asc"]]};
        productCategoryCursor = productCategory.find({}, options);
    },
    waitOn: function() {
        return Meteor.subscribe("productCategory");
    }
});

Template.manageProductCategory.helpers({
    dbProductCategory: function()
    {
        return productCategoryCursor;
    }
});

Template.manageProductCategory.events({
    "submit #addNewProductCategoryForm": function(event, template) {
        event.preventDefault();
        var n = event.target.identifier.value;
        var root;

        root = productCategory.findOne({nameSpa: "/"});
        var oid;
        if ( !valid(root) ) {
            console.log("Creando categoría raíz");
            oid = new Mongo.ObjectID();
            productCategory.insert({_id: oid, nameSpa: "/", parentCategoryId: null});
            root = productCategory.findOne({nameSpa: "/"});
            if ( !valid(root) ) {
                console.log("ERROR: No se encuentra root");
                return;
            }
        }

        oid = new Mongo.ObjectID();
        productCategory.insert({_id: oid, nameSpa: n, parentCategoryId: root._id});
        getTopLevelProductCategories();
    }
});
