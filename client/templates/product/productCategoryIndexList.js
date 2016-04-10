Template.productCategoryIndexList.helpers({
    extractIdFromObjectID: function (oid) {
        return ("" + oid);
    }
});

Template.productCategoryIndexList.events({
    "click .productCategoryMenuOption": function (event, template) {
        // Desactivado por solicitud de Alexis
        //event.preventDefault();
        var f = ("" + event.target.getAttribute("friendlyUrl"));
	if ( valid(f) ) {
	    Router.go("/" + f);
	}
    },
    "click .productCategoryMenuOptionContainer": function (event, template) {
        // Desactivado por solicitud de Alexis
        //event.preventDefault();
        var f = ("" + event.target.getAttribute("friendlyUrl"));
	if ( valid(f) ) {
	    Router.go("/" + f);
	}
    }
});

Template.productCategoryIndexList.helpers({
    dbProductByCategoryId: function(currentCategory) {
        if ( !valid(currentCategory) ) {
            return [{ name: "No hay subcategorias", url: "http://www.google.com" }];
        }

        var menuName = "menu_" + currentCategory._id;
        var m = Session.get(menuName);
        if ( valid(m) ) {
            return m;
        }

        Meteor.call("getSubcategoriesByCategoryId", currentCategory._id, function (error, response) {
            var myarr = [];
            if (!valid(error) && valid(response)) {
                var i;
                for (i in response.children) {
                    var c = response.children[i];
                    myarr.push({ name: c.nameSpa, url: c.friendlyUrl });
                }
                myarr.push({ name: "Todos", url: currentCategory.friendlyUrl });
            }
            else {
                myarr = [{ name: "No se encontraron subcategorias", url: "http://www.google.com" }];
            }
            Session.set(response.menuName, myarr);
        });

        var arr = [
            { name: "Cargando subcategorias", url: "http://www.google.com" }
        ];
        return arr;
    }
});
