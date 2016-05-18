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
        if ( valid(tokens[i]) && tokens[i] !== " " && tokens[i] !== "" ) {
            return tokens[i];
        }
    }

    return null;
}

/**
Algoritmo incremental para actualizar en la base de datos la informacion
correspondiente a la tabla de la variable F en el modelo de ecuacion de
costo Ingenio.
*/
var lastFprovider = "unknown";
var lastFvalues = [];
var processCellF = function(lookupTable, ri, colindex, v)
{
    //console.log("  - F[" + ri + "][" + colindex + "] = " + v);
    if ( ri < 0 ) {
        return;
    }
    if ( colindex === "A" ) {
        lastFprovider = v;
        return;
    }
    if ( colindex !== "B" ) {
        return;
    }

    var f;
    f = lookupTable.findOne({tableName: "f"});
    if ( !valid(f) ) {
        lookupTable.insert({tableName: "f", values: []});
        f = lookupTable.findOne({tableName: "f"});
    }
    if ( !valid(f) ) {
        return;
    }

    lastFvalues[ri] = {provider: lastFprovider, percent: v};
    lookupTable.update({_id: f._id}, {$set: {values: lastFvalues}});
}

var lastGStartRange = 0;
var lastGColumnNames = [];
var lastGvalueMatrix = [];
var extractFirstNumberFromString = function(v)
{
    var tokens = v.split(" ");
    var normalized = tokens[0].split(".").join("");
    var n = parseFloat(normalized);
    return n;
}
var processCellG = function(lookupTable, ri, colindex, v)
{
    console.log("  - G[" + ri + "][" + colindex + "] = " + v);

    if ( ri < 0 ) {
        if ( ri == -1 ) {
            lastGColumnNames[colindex] = v;
        }
        return;
    }
    if ( colindex === "A" ) {
        lastGStartRange = extractFirstNumberFromString(v);
        return;
    }
    else {
        console.log(
            "  - Range " + lastGStartRange + " for provider " + lastGColumnNames[colindex] +
            ": " + v);
        var f;
        f = lookupTable.findOne({tableName: "g"});
        if ( !valid(f) ) {
            lookupTable.insert({tableName: "g", values: []});
            f = lookupTable.findOne({tableName: "g"});
        }
        if ( !valid(f) ) {
            return;
        }
        
        var values = f.values;
        if ( !valid(f.values) ) {
            values = [];
        }
        values.push({startValue: lastGStartRange, provider: lastGColumnNames[colindex]});

        lookupTable.update(f._id, {$set: {values:values}});
    }
}

var processCellH = function(lookupTable, ri, colindex, v)
{
    //console.log("  - H[" + ri + "][" + colindex + "] = " + v);
}

var processCellCH = function(lookupTable, ri, colindex, v)
{
    //console.log("  - CH[" + ri + "][" + colindex + "] = " + v);
}

var processCellI = function(lookupTable, ri, colindex, v)
{
    //console.log("  - I[" + ri + "][" + colindex + "] = " + v);
}

var processCellJ = function(lookupTable, ri, colindex, v)
{
    //console.log("  - J[" + ri + "][" + colindex + "] = " + v);
}

var processCellL = function(lookupTable, ri, colindex, v)
{
    //console.log("  - L[" + ri + "][" + colindex + "] = " + v);
}

var processCellM = function(lookupTable, ri, colindex, v)
{
    //console.log("  - M[" + ri + "][" + colindex + "] = " + v);
}

var processCell = function(inTable, tableDataIndexStart, rowindex, colindex, v)
{
    var ri = (rowindex - tableDataIndexStart - 2);
    var lookupTable = global["lookupTable"];

    if ( !valid(lookupTable) ) {
        return;
    }

    switch ( inTable ) {
      case "F":
        processCellF(lookupTable, ri, colindex, v);
        break;
      case "G":
        processCellG(lookupTable, ri, colindex, v);
        break;
      case "H":
        processCellH(lookupTable, ri, colindex, v);
        break;
      case "CH":
        processCellCH(lookupTable, ri, colindex, v);
        break;
      case "I":
        processCellI(lookupTable, ri, colindex, v);
        break;
      case "J":
        processCellJ(lookupTable, ri, colindex, v);
        break;
      case "L":
        processCellL(lookupTable, ri, colindex, v);
        break;
      case "M":
        processCellM(lookupTable, ri, colindex, v);
        break;
      default:
        console.log("  - UNKNOWN[" + rowindex + "][" + colindex + "] = " + v);
        break;
    }
}

var cleanLookupTables = function()
{
    var lookupTable = global["lookupTable"];

    if ( !valid() ) {
        return;
    }
    console.log("  - Limpiando tablas en la base de datos");
    lookupTable.remove();
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

    cleanLookupTables();

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
