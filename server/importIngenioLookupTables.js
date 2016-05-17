importIngenioLookupTablesFromExcel = function(excel, filename)
{
    console.log("Importando valores para cotizaciones desde " + filename);
    var workbook = excel.readFile(filename);

    var i;
    var ws = null;
    for ( i in workbook.SheetNames ) {
        if ( workbook.SheetNames[i] == "TABLAS" ) {
            ws = workbook.Sheets[workbook.SheetNames[i]];
            break;
        }
    }

    if ( !valid(ws) ) {
        console.log("  * ERROR: No se encuentra la pagina TABLAS en el Excel");
        return;
    }

    var c;

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

        console.log("  - m[" + rowindex + "][" + colindex + "] = " + v);

    }
    console.log("Importacion de categorias Ingenio finalizada");
}
