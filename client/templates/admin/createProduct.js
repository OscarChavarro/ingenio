Router.route("/manageProduct/create", {
    name: "createProduct",
    loadingTemplate: "createProductLoading",
    data: function () {
        // Variables globales con alcance a este módulo
        return true;
    },
    waitOn: function () {
        return Meteor.subscribe("productCategory") && Meteor.subscribe("product") && Meteor.subscribe("product2category") && Meteor.subscribe("supplier") && Meteor.subscribe("multimediaElement") && Meteor.subscribe("product2multimediaElement") && Meteor.subscribe("productEquivalence");
    }
});

Template.createProduct.helpers({
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
