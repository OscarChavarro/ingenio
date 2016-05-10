var isLetter = function(c) {
  return c.toLowerCase() != c.toUpperCase();
}

importIngenioTableFromExcel = function(excel, filename)
{
    console.log("  - Importando desde " + filename);
    var workbook = excel .readFile(filename);
    console.log("  - Listo");

    console.log("  - Datos en la hoja " + workbook.SheetNames[1]);
    var ws = workbook.Sheets[workbook.SheetNames[1]];
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

        if ( j < 3 ) {
        	continue;
        }

        switch ( colindex ) {
          case "B":
        	console.log("  - Referencia: " + v);
        	break;
          case "J":
        	console.log("    . Cat1: " + v);
        	break;
          case "K":
        	console.log("    . Cat2: " + v);
        	break;
          case "L":
        	console.log("    . Cat3: " + v);
        	break;
        }
        //console.log("  - " + c + "=" + JSON.stringify(v));
    }
}
