Router.route("/manageSupplier", {
    name: "manageSupplier",
    loadingTemplate: "manageSupplierLoading",
    data: function () {
        return true;
    },
    waitOn: function () {
        return Meteor.subscribe("supplier");
    }
});

Template.manageSupplier.helpers({
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