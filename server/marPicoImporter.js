var computeFriendlyUrl = function(name)
{
	return "" + name;
    //return name.replace(" ", "-");
}

importMarPicoCollectionsToIngenioCollections = function()
{
    console.log("**** IMPORTING MARPICO ELEMENTS ****");
    var marPicoCategory = global["marPicoCategory"];
    var productCategory = global["productCategory"];

    if ( !valid(marPicoCategory) || !valid(productCategory) ) {
        return "Error: no se encuentran las colecciones";
    }

    var iRootC = productCategory.findOne({nameSpa: "/"});
    if ( !valid(iRootC) ) {
        productCategory.insert({nameSpa: "/", parentCategoryId: null, friendlyUrl: "root"});
        iRootC = productCategory.findOne({nameSpa: "/"});
        if ( !valid(iRootC) ) {
        	return "Error: No se puede crear la categoria raiz";
        }
    }

    console.log("1. Importando categorias:");
    var filter = {parentCategoryId: 0};
    var options = {sort: [["nameSpa", "asc"]]};
    var sourceTopCategoriesArray = marPicoCategory.find(filter, options).fetch();
    var i;

    for ( i in sourceTopCategoriesArray ) {
    	var mpc;
    	mpc = sourceTopCategoriesArray[i];
        console.log("  - " + web2utf(mpc.nameSpa));
        var furl;
        furl = web2utf(computeFriendlyUrl(mpc.id));
        var ic = productCategory.findOne({nameSpa: mpc.nameSpa});
        if ( !valid(ic) ) {
            productCategory.insert({nameSpa: mpc.nameSpa, parentCategoryId: iRootC._id, friendlyUrl: furl});
            ic = productCategory.findOne({nameSpa: mpc.nameSpa});
            if ( !valid(ic) ) {
                return "Error insertando categoria";
            }
        }

        var filter = {parentCategoryId: mpc.id};
        var options = {sort: [["nameSpa", "asc"]]};
        var mpscArray = marPicoCategory.find(filter, options).fetch();
        var j;

        for ( j in mpscArray ) {
        	var mpsc = mpscArray[j];
            console.log("    . " + mpsc.nameSpa);
            furl = web2utf(computeFriendlyUrl(mpsc.id));
            var isc;
            isc = productCategory.findOne(
            	{parentCategoryId: ic._id, nameSpa: mpsc.nameSpa});
            if ( !valid(isc) ) {
            	furl = web2utf(computeFriendlyUrl(mpsc.id));
	            productCategory.insert({nameSpa: mpsc.nameSpa, parentCategoryId: ic._id, friendlyUrl: furl});
	            isc = productCategory.findOne({nameSpa: mpc.nameSpa});
	            if ( !valid(isc) ) {
	                return "Error insertando subcategoria";
	            }
	        }
        }
    }

    return "Ok";
}
