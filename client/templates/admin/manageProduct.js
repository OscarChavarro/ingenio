Router.route("/manageProduct", {
    name: "manageProduct",
    loadingTemplate: "manageProductLoading",
    data: function() {
        var options =  {"sort" : [["nameSpa", "asc"]]};
        productCursor = product.find({}, options);
    },
    waitOn: function() {
        return Meteor.subscribe("productCategory") && Meteor.subscribe("product");
    }
});

Template.manageProduct.helpers({
	dbProduct: function() {
		return productCursor;
	}
});

Template.manageProduct.events({
	"submit #addNewProductForm": function(event, template) {
		event.preventDefault();
		var name = event.target.productName.value;
		var refInternal = event.target.productInternalReference.value;
		var refExternal = event.target.productExternalReference.value;
		var description = event.target.productDescription.value;

		var filter = {
			nameSpa: name,
			internalReference : refInternal,
			externalReference: refExternal,
			descriptionSpa: description
		};
		product.insert(filter);
	}
});
