Router.route("/:friendlyUrl", {
    name: "showProductListByCategory",
    data: function () {
        categoryFriendlyUrl = this.params.friendlyUrl
        return categoryFriendlyUrl;
    }
});

/**
*/
var getProductIndexArrayForCategoryId = function(catFriendlyUrl)
{
    var array;
    var name = "categoryIndexData_" + catFriendlyUrl;
    array = Session.get(name);

    if ( valid(array) ) {
        return array;
    }

    Meteor.call("getProductIndexArrayForCategoryFriendlyUrl", catFriendlyUrl,
        function(error, response) {
            if ( valid(error) ) {
                console.log("Error: " + error);
            }
            else if ( valid(response) ) {
                var n;
                n = "categoryIndexData_" + response.catFriendlyUrl;
                Session.set(n, response.array);
            }
        }
    );

    return [];
}

Template.showProductListByCategory.helpers({
    /**
    Se retorna la URL amigable de la categoria actual
    */
    getCurrentCategoryFriendlyUrl: function() {
        return categoryFriendlyUrl;
    },
    /**
    Se obtienen un indice de productos para la categoria actual
    */
    getProductList: function () {
        return getProductIndexArrayForCategoryId(categoryFriendlyUrl);
    },
    /**
    Returna true si hay productos en la categoria actual y false si no
    */
    hasProducts: function() {
        var indexArray;

        indexArray = getProductIndexArrayForCategoryId(categoryFriendlyUrl);

        if ( indexArray.length > 0 ) {
            return true;
        }
        return false;
    }
});
