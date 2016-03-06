var fs = Npm.require('fs');
//var path = Npm.require('path');

var computeFriendlyUrl = function(name)
{
	return "" + name;
    //return name.replace(" ", "-");
}

importMarPicoCollectionsToIngenioCollections = function()
{
    console.log("**** IMPORTING MARPICO ELEMENTS ****");
    var marPicoCategory = global["marPicoCategory"];
    var marPicoProduct = global["marPicoProduct"];
    var productCategory = global["productCategory"];
    var product2category = global["product2category"];
    var product = global["product"];
    var supplier = global["supplier"];
    var cfs = global["multimediaElementRaw"];
    var product2multimediaElement = global["product2multimediaElement"];

    if ( !valid(marPicoCategory) || !valid(productCategory) || 
    	 !valid(marPicoProduct) || !valid(product) ||
    	 !valid(product2category) ) {
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
    var categoryHashTable = {};
    var productHashTable = {};

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
        categoryHashTable[mpc.id] = ic._id;

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
            categoryHashTable[mpsc.id] = isc._id;
        }
    }

    console.log("2. Importando productos:");
    var cursor = marPicoProduct.find();
    var provider = supplier.findOne({name: "MarPico"});
    if ( !valid(provider) ) {
    	return "Error: no esta el proveedor MarPico";
    }

    var count = 1;
    cursor.forEach(function(mpp) {
    	console.log("  - " + mpp.name);
    	var ip;

    	ip = product.findOne({marPicoProductId: mpp.id});
    	var ipid;
    	if ( !valid(ip) ) {
	    	ip = {
	            nameSpa: web2utf(getName(mpp.name)),
	            supplierId: provider._id,
	            supplierReference: web2utf(getReferenceFromName(mpp.name)),
	            internalIngenioReference: "ING" + count,
	            descriptionSpa: mpp.description,
	            price: mpp.price,
	            friendlyUrl: "ING" + count,
	            marPicoProductId: mpp.id
	    	};
	    	ipid = product.insert(ip);
	    }
	    else {
	    	ipid = ip._id;
	    }

        if ( valid(ipid) ) {
        	productHashTable[mpp.id] = ipid;
	        for( i in mpp.arrayOfparentCategoriesId ) {
	        	var mpcid = mpp.arrayOfparentCategoriesId[i];
	            if ( valid(categoryHashTable[mpcid]) ) {
                    product2category.insert({
                    	productId: ipid,
                    	categoryId: categoryHashTable[mpcid]
                    });
	            }
	        }
	    }
        count++;
    });

    console.log("3. Importando imagenes:");
    //var path = "/home/jedilink/_netbeans_workspace/86_IngenioMarpicoDownloader_Desktop/output/images";
    var path = "/home/jedilink/images";
    //var destinationPath = "/home/jedilink/usr/ingenio/ingenioSynced/.meteor/local/cfs/files/multimediaElement";
    var destinationPath = "/var/www/cfs/files/multimediaElement";

    var folderArr = fs.readdirSync(path);
    for ( i in folderArr ) {
        console.log("  - " + folderArr[i]);

        var marPicoProductId = parseInt(folderArr[i]);

		var mpp = marPicoProduct.findOne({id: marPicoProductId});        
		if ( valid(mpp) ) {
	        var fileArr = fs.readdirSync(path + "/" + folderArr[i]);
	        var j;
	        for ( j in fileArr ) {
	            var date = new Date();
	            var me = cfs.insert({uploadedAt: date});

	            if ( valid(me) ) {
		            var fileSize;
		            var filename = path + "/" + folderArr[i] + "/" + fileArr[j];
		            var fileInfo = fs.lstatSync(filename);
		            fileSize = fileInfo.size;
		            var o = {
		            	name: fileArr[j],
		            	updatedAt: date,
		            	size: fileSize,
		            	type: "image/jpeg"
		            };
		            var destinationName = "multimediaElement-" + me + "-" + fileArr[j];
		            var c = {multimediaElement: {
		            	name: fileArr[j],
		            	type: "image/jpeg",
		            	size: fileSize,
		            	key: destinationName,
		            	updatedAt: date,
		            	createdAt: date
		            }};
		            cfs.update({_id: me}, {$set: {original: o, copies: c}});

                    if ( !fs.existsSync(destinationPath + "/" + destinationName) ) {
		                fs.link(filename, destinationPath + "/" + destinationName);
		            }

                    product2multimediaElement.insert(
                    	{
                    		productId: productHashTable[marPicoProductId],
                    		multimediaElementId: me
                    	});
	            }
	        }
	    }
    }

    return "Ok";
}
