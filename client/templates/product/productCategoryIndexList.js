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
    dbProductByCategoryId: function(parent) {
        var arr = [
            {name: "Producto 1", url: "http://www.google.com"},
            {name: "Producto 2", url: "http://www.youtube.com"}
        ];
        /*
        var catId = parent._id;
        Meteor.call("getSubcategoriesByCategoryId", catId, function (error, children) {
            if (!valid(error) && valid(children)) {
                var i;
                console.log("Tengo hijos: " + children.length);
                for ( i in children ) {
                    console.log("  - " + children[i]);
                }
            }
            else {
                var arr = [{name: "No se encontraron productos", url: "http://www.google.com"}];
            }
        });
        */

        return arr;
    }
});
