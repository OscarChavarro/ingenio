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
        console.log("Important stuff");
        return productGallery.list();
    },
    readURL: function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }
});

Template.createProduct.events({
    'change #productImages': function (event, template) {
        console.log("Stuff");
        productGallery.clear();
        FS.Utility.eachFile(event, function (file) {
            productGallery.push(file);
        });
        console.log(productGallery.list());
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
