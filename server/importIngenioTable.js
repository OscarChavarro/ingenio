var isLetter = function(c) {
  return c.toLowerCase() != c.toUpperCase();
}

importIngenioTableFromExcel = function(excel, filename)
{
    console.log("Importando asociaciones de categorias ingenio desde " + filename);
    var workbook = excel .readFile(filename);
    var ws = workbook.Sheets[workbook.SheetNames[1]];
    var c;

    var marPicoProduct = global["marPicoProduct"];

    if ( !valid(marPicoProduct) ) {
        console.log("  * ERROR: base de datos no disponible");
        return;
    }

    var elem = {};

    for ( c in ws ) {
        if( c[0] === '!' ) {
        	continue;
        }
        var v = ws[c].v;
        if ( !valid(v) || v === "" ) {
        	continue;
        }

        var colindex = "";
        var rowindex = "";
        var i;
        var inCol = true;
        for ( i = 0; i < c.length; i++ ) {
            var ci = c.charAt(i);
            if ( inCol == false || !isLetter(ci) ) {
                inCol = false;
            }

            if ( inCol ) {
                colindex += ci;
            }
            else {
            	rowindex += ci;
            }
        }
        var j = parseInt(rowindex);

        if ( j < 3 ) {
        	continue;
        }

        switch ( colindex ) {
          case "B":
            elem = {}
        	//console.log("  - Referencia: " + v);
            elem.marpicoReference = v;
        	break;
          case "J": 
        	//console.log("    . Cat: " + v);
            elem.ingenioCategory = v;
        	break;
          case "K":
        	//console.log("    . Subcat 1: " + v);
            elem.ingenioSubCategory1 = v;
        	break;
          case "L":
        	//console.log("    . Subcat 2: " + v);
            elem.ingenioSubCategory2 = v;
        	break;
          case "M":
        	//console.log("    . Subcat 3: " + v);
            elem.ingenioSubCategory3 = v;

            // Procesar registro
            var re = {$regex: "" + elem.marpicoReference};
            var mpp = marPicoProduct.findOne({name: re});

            if ( !valid(mpp) ) {
                console.log("  - Error: no se encuentra producto marpico para " + elem.marpicoReference);
                continue;
            }
            marPicoProduct.update({_id: mpp._id}, {$set: {ingenioCategory: elem.ingenioCategory}});
            marPicoProduct.update({_id: mpp._id}, {$set: {ingenioSubCategory1: elem.ingenioSubCategory1}});
            marPicoProduct.update({_id: mpp._id}, {$set: {ingenioSubCategory2: elem.ingenioSubCategory2}});
            marPicoProduct.update({_id: mpp._id}, {$set: {ingenioSubCategory3: elem.ingenioSubCategory3}});
        	break;
        }


    }
    console.log("Importacion de categorias Ingenio finalizada");
}
