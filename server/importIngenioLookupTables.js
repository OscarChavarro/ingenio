var processTableBegin = function(v)
{
    var tag;
    var tokens;

    tokens = v.split(" ");
    if ( tokens.length < 2 ) {
        return null;
    }

    var i;
    for ( i = 1; i < tokens.length; i++ ) {
        console.log("* [" + tokens[i] + "]");
        if ( valid(tokens[i]) && tokens[i] !== " " && tokens[i] !== "" ) {
            return tokens[i];
        }
    }

    return null;
}

var processCellF = function(ri, colindex, v)
{
    console.log("  - F[" + ri + "][" + colindex + "] = " + v);
}

var processCellG = function(ri, colindex, v)
{
    console.log("  - G[" + ri + "][" + colindex + "] = " + v);
}

var processCellH = function(ri, colindex, v)
{
    console.log("  - H[" + ri + "][" + colindex + "] = " + v);
}

var processCellCH = function(ri, colindex, v)
{
    console.log("  - CH[" + ri + "][" + colindex + "] = " + v);
}

var processCellI = function(ri, colindex, v)
{
    console.log("  - I[" + ri + "][" + colindex + "] = " + v);
}

var processCellJ = function(ri, colindex, v)
{
    console.log("  - J[" + ri + "][" + colindex + "] = " + v);
}

var processCellL = function(ri, colindex, v)
{
    console.log("  - L[" + ri + "][" + colindex + "] = " + v);
}

var processCellM = function(ri, colindex, v)
{
    console.log("  - M[" + ri + "][" + colindex + "] = " + v);
}

var processCell = function(inTable, tableDataIndexStart, rowindex, colindex, v)
{
    var ri = (rowindex - tableDataIndexStart - 2);

    switch ( inTable ) {
      case "F":
        processCellF(ri, colindex, v);
        break;
      case "G":
        processCellG(ri, colindex, v);
        break;
      case "H":
        processCellH(ri, colindex, v);
        break;
      case "CH":
        processCellCH(ri, colindex, v);
        break;
      case "I":
        processCellI(ri, colindex, v);
        break;
      case "J":
        processCellJ(ri, colindex, v);
        break;
      case "L":
        processCellL(ri, colindex, v);
        break;
      case "M":
        processCellM(ri, colindex, v);
        break;
      default:
        console.log("  - UNKNOWN[" + rowindex + "][" + colindex + "] = " + v);
        break;
    }
}

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
    var inTable = null;
    var tableDataIndexStart = 0;

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
        var ri = parseInt(rowindex);

        if ( colindex === "A" && v.indexOf("TABLA") == 0 ) {
            inTable = processTableBegin(v);
            console.log("COMENZANDO TABLA " + inTable);
            tableDataIndexStart = ri;
        }
        if ( valid(inTable) ) {
            processCell(inTable, tableDataIndexStart, rowindex, colindex, v);
        }
    }
    console.log("Importacion de categorias Ingenio finalizada");
}
