Router.route("/manageProductEquivalence", {
    name: "manageProductEquivalence",
    loadingTemplate: "manageProductEquivalenceLoading",
    data: function () {
        return true;
    },
    waitOn: function () {
        return Meteor.subscribe("productEquivalence") && Meteor.subscribe("product");
    }
});

Template.manageProductEquivalence.helpers({
    getList: function () {
        var equivalences = productEquivalence.find().fetch();
        equivalences.forEach(function (element, index, array) {
            equivalences[index].firstProductId = product.findOne({ _id: equivalences[index].firstProductId });
            equivalences[index].secondProductId = product.findOne({ _id: equivalences[index].secondProductId });
        });
        return equivalences;
    },
    getProductList: function () {
        return product.find().fetch();
    }
});

Template.manageProductEquivalence.events({
    'submit .insertProductEquivalence': function (event) {
        event.preventDefault();
        if (!valid(event.target.firstProductId.value) || event.target.firstProductId.value.length <= 0) {
            alert("Debe seleccionar un primer producto.");
            return false;
        }
        if (!valid(event.target.secondProductId.value) || event.target.secondProductId.value.length <= 0) {
            alert("Debe seleccionar un segundo producto.");
            return false;
        }

        if (event.target.firstProductId.value === event.target.secondProductId.value) {
            alert("Los productos a equivaler no pueden ser los mismos.");
            return false;
        }
        if (typeof productEquivalence.findOne({ firstProductId: event.target.firstProductId.value, secondProductId: event.target.secondProductId.value }) != "undefined") {
            alert("Ya existe una equivalencia con los mismos productos involucrados.");
            return false;
        }
        productEquivalence.insert({
            firstProductId: event.target.firstProductId.value,
            secondProductId: event.target.secondProductId.value
        });
        $("#firstProductId").val("");
        $("#secondProductId").val("");
        alert("Equivalencia agregada satisfactoriamente.");
    }
});