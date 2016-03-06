Template.productCategoryIndexList.helpers({
    extractIdFromObjectID: function (oid) {
        return ("" + oid);
    }
});

Template.productCategoryIndexList.events({
    // Desactivado por solicitud de Alexis
    /*
    "click .productCategoryMenuOption": function (event, template) {
        event.preventDefault();
        var catId = ("" + event.target.getAttribute("data-id"));
        Meteor.call("getSubcategoriesByCategoryId", catId, function (error, children) {
            if (!valid(error) && valid(children)) {
                var html = "";
                html += '<ul class="sub-cat">';
                var i;
                for (i in children) {
                    html += '<li><a class="link-a" href="/' + children[i].friendlyUrl + '">' + children[i].nameSpa + '</a></li>';
                }
                html += '</ul>';
                document.getElementById(catId).innerHTML = html;
            } else {
                document.getElementById(catId).innerHTML = "No se encontraron subcategorias.";
            }
        });
    }
    */
});

Template.productCategoryIndexList.helpers({
    dbProductByCategoryId: function(currentCategory) {
        if ( !valid(currentCategory) ) {
            return [{name: "No hay subcategorias", url: "http://www.google.com"}];
        }

        var menuName = "menu_" + currentCategory._id;
        var m = Session.get(menuName);
        if ( valid(m) ) {
            return m;
        }

        Meteor.call("getSubcategoriesByCategoryId", currentCategory._id, function (error, response) {
            var myarr = [];
            if ( !valid(error) && valid(response) ) {
                var i;
                for ( i in response.children ) {
                    var c = response.children[i];
                    myarr.push({name: c.nameSpa, url: c.friendlyUrl});
                }
                myarr.push({name: "Todos", url: "http://pendiente"});
            }
            else {
                myarr = [{name: "No se encontraron subcategorias", url: "http://www.google.com"}];
            }
            Session.set(response.menuName, myarr);
        });

        var arr = [
            {name: "Cargando subcategorias", url: "http://www.google.com"}
        ];
        return arr;
    }
});
