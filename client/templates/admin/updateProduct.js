Router.route("/manageProduct/update/:id", {
    name: "updateProduct",
    loadingTemplate: "updateProductLoading",
    data: function () {
        return this.params.id;
    },
    waitOn: function () {
        return Meteor.subscribe("productCategory") && Meteor.subscribe("product") && Meteor.subscribe("product2category") && Meteor.subscribe("supplier") && Meteor.subscribe("multimediaElement") && Meteor.subscribe("product2multimediaElement") && Meteor.subscribe("productEquivalence");
    }
});

Template.updateProduct.helpers({
    categoryList: function () {
        var list = [];
        productCategory.find().fetch().forEach(function (element, index, array) {
            if (element.nameSpa != "/") {
                list.push(element);
            }
        });
        return list;
    },
    supplierList: function () {
        return supplier.find().fetch();
    },
    getCurrent: function () {
        var current = product.findOne({ _id: Template.currentData() })
        return current;
    },
    isCurrentSupplier: function (supplierId) {
        var current = product.findOne({ _id: Router.current().params.id });
        return (supplierId === (product.findOne({ _id: Router.current().params.id })).supplierId);
    },
    isProductInCategory: function (categoryId) {
        var isCurrent = product2category.findOne({ productId: Router.current().params.id, categoryId: categoryId });
        return (typeof isCurrent != "undefined");
    }
});

AutoForm.addHooks(['updateProduct'], {
    before: {
        update: function (doc) {
            var cont = 0;
            $("input[name='categories']").each(function (index) {
                if ($(this).is(":checked")) {
                    cont++;
                }
            });

            if (cont === 0) {
                alert('Debe elegir al menos una Categoria.');
                return false;
            }

            if ($("#productSupplier").val().length <= 0) {
                alert("Debe especificar un Proveedor para el producto.");
                return false;
            } else {
                product.update({ _id: doc._id }, { $set: { supplierId: $("#productSupplier").val() } });
            }

            if (valid(doc.friendlyUrl)) {
                if (typeof product.findOne({ friendlyUrl: doc.friendlyUrl.toLowerCase() }) != "undefined") {
                    alert("Ya existe un producto con la URL amigable especificada.");
                    return false;
                }
            }

            return doc;
        }
    },
    onSuccess: function (formType, result) {
        var current = product.findOne({ _id: Router.current().params.id });
        product2category.find({ productId: current._id }).fetch().forEach(function (element, index, array) {
            product2category.remove(element._id);
        });

        $("input[name='categories']").each(function (index) {
            if ($(this).is(":checked")) {
                product2category.insert({
                    productId: current._id,
                    categoryId: $(this).val()
                });
                $(this).removeAttr('checked');
            }
        });
        alert("Producto actualizado con éxito.");
        Router.go("/manageProduct");
    }
});
