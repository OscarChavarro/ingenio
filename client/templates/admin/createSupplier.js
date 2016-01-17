Router.route("/manageSupplier/create", {
    name: "createSupplier",
    loadingTemplate: "createSupplierLoading",
    data: function () {
        return true;
    },
    waitOn: function () {
        return Meteor.subscribe("supplier");
    }
});

Template.createSupplier.helpers({
    getList: function () {
        return supplier.find().fetch();
    }
});

AutoForm.addHooks(['insertSupplier'], {
    before: {
        insert: function (doc) {
            return doc;
        }
    },
    onSuccess: function (formType, result) {

    }
});