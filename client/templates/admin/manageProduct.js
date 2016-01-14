Router.route("/manageProduct", {
    name: "manageProduct",
    loadingTemplate: "manageProductLoading",
    data: function () {
        var options = { "sort": [["nameSpa", "asc"]] };
        productCursor = product.find({}, options);
    },
    waitOn: function () {
        return Meteor.subscribe("productCategory") && Meteor.subscribe("product") && Meteor.subscribe("product2category") && Meteor.subscribe("supplier") && Meteor.subscribe("multimediaElement") && Meteor.subscribe("product2multimediaElement") && Meteor.subscribe("productEquivalence");
    }
});

Template.manageProduct.helpers({
    dbProduct: function () {
        return productCursor;
    },
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
    onBeforeDelete: function () {
        return function (collection, id) {
            var doc = collection.findOne(id);
            if (confirm('¿Está seguro que desea eliminar el producto "' + doc.nameSpa + '"?')) {
                product2multimediaElement.find({ productId: doc._id }).forEach(function (element, index, array) {
                    product2multimediaElement.remove(element._id);
                })
                product2category.find({ productId: doc._id }).forEach(function (element, index, array) {
                    product2category.remove(element._id);
                });
                productEquivalence.find({ firstProductId: doc._id }).forEach(function (element, index, array) {
                    productEquivalence.remove(element._id);
                });
                productEquivalence.find({ secondProductId: doc._id }).forEach(function (element, index, array) {
                    productEquivalence.remove(element._id);
                });
                this.remove();
            }
        };
    }
});

AutoForm.addHooks(['insertProduct'], {
    before: {
        insert: function (doc) {
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
                doc.supplierId = $("#productSupplier").val();
            }

            return doc;
        }
    },
    onSuccess: function (formType, result) {
        $("input[name='categories']").each(function (index) {
            console.log($(this).val());
            if ($(this).is(":checked")) {
                product2category.insert({
                    productId: result,
                    categoryId: $(this).val()
                });
                $(this).removeAttr('checked');
            }
        });
        //console.log($('.myFileInput').get(0).files);
        var currentOrder = 1;
        FS.Utility.eachFile({
            originalEvent: {
                target: {
                    files: $('#productImages').get(0).files
                }
            }
        }, function (file) {
            multimediaElement.insert(file, function (err, fileObj) {
                product2multimediaElement.insert({
                    productId: result,
                    multimediaElementId: fileObj._id,
                    order: currentOrder
                });
                currentOrder++;
            });
        });
        alert("Producto registrado con éxito.");
    }
});
