Router.route("/manageSupplier/update/:id", {
    name: "updateSupplier",
    loadingTemplate: "updateSupplierLoading",
    data: function () {
        return this.params.id;
    },
    waitOn: function () {
        return Meteor.subscribe("supplier");
    }
});

Template.updateSupplier.helpers({
    getCurrent: function () {
        return supplier.findOne({ _id: Template.currentData() });
    }
});