Router.route("/manageProductCategory/create", {
    name: "createProductCategory",
    loadingTemplate: "createProductCategoryLoading",
    data: function () {
        var options = { "sort": [["nameSpa", "asc"]] };
        productCategoryCursor = productCategory.find({}, options);
    },
    waitOn: function () {
        return Meteor.subscribe("productCategory") && Meteor.subscribe("product2category");
    }
});

AutoForm.addHooks(['insertCategory'], {
    before: {
        insert: function (doc) {
            if ($("#parentCategories").val().length <= 0) {
                var root = productCategory.findOne({ nameSpa: "/" });
                if (!valid(root)) {
                    alert("Ocurrió un error inesperado.");
                    return false;
                } else {
                    doc.parentCategoryId = root._id;
                }
            } else {
                doc.parentCategoryId = $("#parentCategories").val();
            }

            if (typeof productCategory.findOne({ nameSpa: doc.nameSpa }) != "undefined") {
                alert("Ya existe una categoria con el nombre especificado.");
                return false;
            }

            if (valid(doc.friendlyUrl)) {
                if (typeof productCategory.findOne({ friendlyUrl: doc.friendlyUrl.toLowerCase() }) != "undefined") {
                    alert("Ya existe una categoria con la URL amigable especificada.");
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
        getTopLevelProductCategories();
        alert("Categoría registrada con éxito.");
    }
});
