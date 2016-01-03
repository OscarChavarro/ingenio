Router.route("/manageProductCategory", {
    name: "manageProductCategory",
    loadingTemplate: "manageProductCategoryLoading",
    data: function() {
        var options =  {"sort" : [["nameSpa", "asc"]]};
        productCategoryCursor = productCategory.find({}, options);
    },
    waitOn: function() {
        return Meteor.subscribe("productCategory");
    }
});

Template.manageProductCategory.helpers({
    dbProductCategory: function()
    {
        return productCategoryCursor;
    }
});

Template.manageProductCategory.events({
    "submit #addNewProductCategoryForm": function(event, template) 
    {
        event.preventDefault();
        var n = event.target.identifier.value;
        var root;
        var oid;

        root = productCategory.findOne({nameSpa: "/"});
        if ( !valid(root) ) {
            console.log("Creando categoría raíz");
            oid = new Mongo.ObjectID();
            productCategory.insert({_id: oid, nameSpa: "/", parentCategoryId: null});
            root = productCategory.findOne({nameSpa: "/"});
            if ( !valid(root) ) {
                console.log("ERROR: No se encuentra root");
                return;
            }
        }

        var parent;

        parent = ("" + event.target.parentCategories.value).substring(10, 34);
        parent = "ObjectID(\"" + parent + "\")";

        if ( !valid(parent) || parent === "null" ) {
            parent = root._id;
        }

        oid = new Mongo.ObjectID();
        productCategory.insert({_id: oid, nameSpa: n, parentCategoryId: parent});
        getTopLevelProductCategories();
    },
    "submit .categoryDelete": function(event, template) 
    {
        event.preventDefault();

        productCategory.remove(this._id);
        getTopLevelProductCategories();
    },
    "keyup .editCategoryName": function(event, template) 
    {
        event.preventDefault();

        if ( !valid(this._id) || !valid(event.target.value) ) {
            return false;
        }

        productCategory.update(this._id, {$set: {nameSpa: event.target.value}});
        getTopLevelProductCategories();
    },
    "change .parentCategories": function(event, template)
    {
        event.preventDefault();
        var elementData = event.target.value;

        root = productCategory.findOne({nameSpa: "/"});
        if ( !valid(elementData) || !valid(root) ) {
            console.log("Cancelando cambio por no tener nodo root");
            return false;
        }

        var myId = new Mongo.ObjectID(elementData.substring(10, 34));

        if ( elementData.length < 37 ) {
            console.log("Cambio a " + myId + " a root");
        }
        else {
            var parentId = elementData.substring(46, 70);
            console.log("Cambio a " + myId + " a " + parentId);
        }

        // Esto debe tener en cuenta varios casos:
        // 1. No se cambia a que el padre sea él mismo, para evitar dependencia circular
        // 2. No se cambia a un padre que no sea de nivel 1
        // 3. No se cambia al root
    }
});

Template.categorySelectionChange.helpers({
    containerIsParent: function(container, subjectBeingTested) {
        if ( !valid(container) || !valid(subjectBeingTested) || 
             !valid(subjectBeingTested.parentCategoryId) || !valid(container._id) ) {
            return false;
        }

        var sid = "" + subjectBeingTested.parentCategoryId;
        if ( sid.indexOf("ObjectID(") > -1 ) {
            sid = sid.substring(10, 34);
        }
        var cid = "" + container._id;
        if ( sid === cid ) {
            return true;
        }
        return false;
    }
});
