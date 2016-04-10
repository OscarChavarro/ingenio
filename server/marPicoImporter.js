var fs = Npm.require('fs');
//var path = Npm.require('path');

var computeFriendlyUrl = function(name)
{
    return "" + name;
    //return name.replace(" ", "-");
}

var importImagesToProducts = function(marPicoProduct, productHashTable, product)
{
    console.log("3. Importando imagenes:");
    var path;

    if ( process.env.HOSTNAME === "test.ingenio-promocionales.com" ) {
        path = "/home/jedilink/82_IngenioDownloader_Desktop/output/images";
    }
    else {
	path = "/home/jedilink/_netbeans_workspace/86_IngenioMarpicoDownloader_Desktop/output/images";
    }

    var folderArr = fs.readdirSync(path);
    if ( !valid(folderArr) || !valid(folderArr.length) || folderArr.length <= 0 ) {
        console.log("  - ERROR: no se encontraron imágenes de producto. Revisar ruta " + path);
        return;
    }

    for ( i in folderArr ) {
        //console.log(
        //"  - Procesando imágenes para el producto de id MarPico " +
        //folderArr[i]);
        var marPicoProductId = parseInt(folderArr[i]);
        var mpp = marPicoProduct.findOne({id: marPicoProductId});        
        if ( !valid(mpp) ) {
            console.log("         -> NO SE ENCUENTRA PRODUCTO MPP: " +
			marPicoProductId);
	    // Esto ocurre normalmente cuando se tienen imagenes de
	    // antiguos productos que MarPico ya no tiene en su inventario.
	    // Por esa razón el comportamiento será mover la carpeta a
	    // una carpeta de archivo histórico.
	    var oldImagesPath = path + "/../oldImages";
	    if ( !fs.existsSync(oldImagesPath) ) {
		console.log("*****CREANDO: " + oldImagesPath);
		fs.mkdir(oldImagesPath);
	    }
	    if ( !fs.existsSync(oldImagesPath) ) {
                continue;
	    }
	    var stat = fs.statSync(oldImagesPath);
	    if ( !stat.isDirectory() ) {
		continue;
	    }
	    fs.mkdir(oldImagesPath + "/" + folderArr[i]);
	    console.log("             - Moviendo carpeta de un lao pa otro");
	    // Atención: Revisar si esto está borrando las cosas...
	    //fs.renameSync(
            //    path + "/" + folderArr[i], oldImagesPath + folderArr[i]);
            continue;
        }
        var pid = productHashTable[marPicoProductId];
        var p = product.findOne({_id: pid});
        if ( !valid(p) ) {
            console.log("         -> NO SE ENCUENTRA PRODUCTO P: " +
                mpp.name);
            continue;
        }
        if ( valid(mpp) ) {
            var fileArr = fs.readdirSync(path + "/" + folderArr[i]);
            var j;
            var multimediaElementsArr = [];
            for ( j in fileArr ) {
                var filename = folderArr[i] + "/" + fileArr[j];
                multimediaElementsArr.push(filename);
            }
            product.update(
                {_id: pid},
                {$set: {multimediaElementsArr: multimediaElementsArr}}
            );
            var arrVc = [];
            var arrVd = [];
            var arrVq = [];
            for ( j in mpp.arrayOfVariants ) {
                var mpa = mpp.arrayOfVariants[j];
                arrVc.push(mpa.reference);
                arrVd.push(mpa.description);
                arrVq.push(mpa.quantityTotal);
            }
            product.update(
                {_id: pid}, {$set: {variantCodesArr: arrVc}});
            product.update(
                {_id: pid}, {$set: {variantDescriptionsArr: arrVd}});
            product.update(
                {_id: pid}, {$set: {variantQuantitiesArr: arrVq}});
        }
    }
}

var importImagesToCfs = function(marPicoProduct, productHashTable)
{
    var cfs = global["multimediaElementRaw"];
    var product2multimediaElement = global["product2multimediaElement"];

    console.log("3. Importando imagenes:");
    var path = "/home/jedilink/_netbeans_workspace/86_IngenioMarpicoDownloader_Desktop/output/images";
    //var path = "/home/jedilink/82_IngenioDownloader_Desktop/output/images";
    var destinationPath = "/home/jedilink/usr/ingenio/ingenioSynced/.meteor/local/cfs/files/multimediaElement";
    //var destinationPath = "/var/www/cfs/files/multimediaElement";

    var folderArr = fs.readdirSync(path);
    if ( !valid(folderArr) || !valid(folderArr.length) || folderArr.length <= 0 ) {
        console.log("  - ERROR: no se encontraron imágenes de producto. Revisar ruta " + path);
        return;
    }

    for ( i in folderArr ) {
        console.log("  - Procesando imágenes para el producto de id " + folderArr[i]);

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
    //oldcfs.drop();
    //csf.rename("cfs.multimediaElement.filerecord", function(e, c){});
}

importMarPicoCollectionsToIngenioCollections = function()
{
    console.log("**** IMPORTANDO ELEMENTOS MARPICO ****");
    var marPicoCategory = global["marPicoCategory"];
    var marPicoProduct = global["marPicoProduct"];
    var productCategory = global["productCategory"];
    var product2category = global["product2category"];
    var product = global["product"];
    var supplier = global["supplier"];
    var oldcfs = global["multimediaElementRaw"];

    if ( !valid(marPicoCategory) || !valid(productCategory) || 
         !valid(marPicoProduct) || !valid(product) ||
         !valid(product2category) ) {
        return "Error: no se encuentran las colecciones";
    }

    var iRootC = productCategory.findOne({nameSpa: "/"});
    if ( !valid(iRootC) ) {
        productCategory.insert(
	    {nameSpa: "/", parentCategoryId: null, friendlyUrl: "root"});
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
        
        var furl;
        furl = web2utf(computeFriendlyUrl(mpc.id));
        var ic = productCategory.findOne({nameSpa: web2utf(mpc.nameSpa)});
        if ( !valid(ic) ) {
            productCategory.insert({nameSpa: web2utf(mpc.nameSpa), parentCategoryId: iRootC._id, friendlyUrl: furl});
            ic = productCategory.findOne({nameSpa: web2utf(mpc.nameSpa)});
            if ( !valid(ic) ) {
                return "Error insertando categoria";
            }
        }
        categoryHashTable[mpc.id] = ic._id;
        console.log("  - " + web2utf(mpc.nameSpa) + " (" + mpc.id + " -> " + ic._id + ")");

        var filter = {parentCategoryId: mpc.id};
        var options = {sort: [["nameSpa", "asc"]]};
        var mpscArray = marPicoCategory.find(filter, options).fetch();
        var j;

        for ( j in mpscArray ) {
            var mpsc = mpscArray[j];
            furl = web2utf(computeFriendlyUrl(mpsc.id));

            var isc;
            isc = productCategory.findOne(
                {parentCategoryId: ic._id, nameSpa: web2utf(mpsc.nameSpa)});
            var ncid;
            if ( !valid(isc) ) {
                furl = web2utf(computeFriendlyUrl(mpsc.id));
                ncid = productCategory.insert(
                    {nameSpa: web2utf(mpsc.nameSpa), parentCategoryId: ic._id, friendlyUrl: furl});
                if ( !valid(ncid) ) {
                    return "Error insertando subcategoria";
                }
            }
            else {
                ncid = isc._id;
            }
            categoryHashTable[mpsc.id] = ncid;
            console.log("    . " + web2utf(mpsc.nameSpa) + " (" + mpsc.id + " -> " + ncid + ")");
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
	if ( mpp.name.indexOf("Antiestr") > -1 ) {
            console.log("  - " + web2utf(mpp.name));
	}
        var ip;

        ip = product.findOne({marPicoProductId: mpp.id});
        var ipid;
        if ( !valid(ip) ) {
            ip = {
                nameSpa: web2utf(getName(mpp.name)),
                supplierId: provider._id,
                supplierReference: web2utf(getReferenceFromName(mpp.name)),
                internalIngenioReference: "ING" + count,
                descriptionSpa: web2utf(mpp.description),
                materialSpa: web2utf(mpp.material),
                markingSupportedSpa: web2utf(mpp.markingSupported),
                measures: web2utf(mpp.measures),
                printAreaSpa: web2utf(mpp.printArea),
                packingSpa: web2utf(mpp.packing),
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

    //importImagesToCfs(marPicoProduct, productHashTable);
    importImagesToProducts(marPicoProduct, productHashTable, product);
    console.log("==== IMPORTACION DE PRODUCTOS MARPICO LISTA ====");
    
    return "Ok";
}
