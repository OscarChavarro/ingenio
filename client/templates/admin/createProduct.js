productGallery = undefined;
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

Template.createProduct.onCreated(function () {
    productGallery = new ReactiveArray([]);
    for (var i = 1; i <= 6; i++) {
        $("#productImage" + i).val("");
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
    },
    getCurrentGalleryList: function () {
        return productGallery.list();
    },
    readURL: function (file, index) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#image' + index).attr('src', e.target.result);
        }

        reader.readAsDataURL(file);
    }
});

Template.createProduct.events({
    'change .product-image': function (event, template) {
        productGallery.clear();
        for (var i = 1; i <= 6; i++) {
            if ($("#productImage" + i).val() != "") {
                FS.Utility.eachFile({
                    originalEvent: {
                        target: {
                            files: $("#productImage" + i).get(0).files
                        }
                    }
                }, function (file) {
                    productGallery.push(file);
                });
            }
        }
    },
    'click .add-image': function (event, template) {
        for (var i = 1; i <= 6; i++) {
            if ($("#productImage" + i).val() == "") {
                $("#productImage" + i).click();
                return false;
            }
        }
    },
    'click .remove-image': function (event, template) {
        var empty = 0;
        for (var i = 1; i <= 6; i++) {
            if ($("#productImage" + i).val() == "") {
                if (i === 1) {
                    $("#productImage" + i).val("");
                } else {
                    $("#productImage" + (i - 1)).val("");
                }
                empty++;
            }
        }
        if (empty === 0) {
            $("#productImage6").val("");
        }
        productGallery.clear();
        for (var i = 1; i <= 6; i++) {
            if ($("#productImage" + i).val() != "") {
                FS.Utility.eachFile({
                    originalEvent: {
                        target: {
                            files: $("#productImage" + i).get(0).files
                        }
                    }
                }, function (file) {
                    productGallery.push(file);
                });
            }
        }
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
        $("input[name='categories']").each(function (index) {
            if ($(this).is(":checked")) {
                product2category.insert({
                    productId: result,
                    categoryId: $(this).val()
                });
                $(this).removeAttr('checked');
            }
        });
        var currentOrder = 1;

        for (var i = 1; i <= 6; i++) {
            if ($("#productImage" + i).val() != "") {
                FS.Utility.eachFile({
                    originalEvent: {
                        target: {
                            files: $("#productImage" + i).get(0).files
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
            }
        }

        alert("Producto registrado con éxito.");
    }
});
