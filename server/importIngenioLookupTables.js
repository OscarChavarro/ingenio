var valuesG;
var valuesI;
var valuesLM;

var extractFirstNumberFromString = function(v)
{
    var tokens = v.split(" ");
    var normalized = tokens[0].split(".").join("");
    var n = parseFloat(normalized);
    return n;
}

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
var processCellG = function(lookupTable, ri, colindex, v)
{
    //console.log("  - G[" + ri + "][" + colindex + "] = " + v);

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
        var i;
        var p = null;
        for ( i in valuesG ) {
            if ( valuesG[i].startValue == lastGStartRange ) {
                p = valuesG[i];
                break;
            }
        }
        if ( !valid(p) ) {
            valuesG.push({startValue: lastGStartRange, discountArray: []});
            for ( i in valuesG ) {
                if ( valuesG[i].startValue == lastGStartRange ) {
                    p = valuesG[i];
                    break;
                }
            }
        }

        if ( !valid(valuesG[i]) ) {
            return;
        }

        var newcell = {provider: lastGColumnNames[colindex], discountPercent: v};
        valuesG[i].discountArray.push(newcell);
    }
}

var lastHrange = 0;
var lastHvalues = [];
var processCellH = function(lookupTable, ri, colindex, v)
{
    //console.log("  - H[" + ri + "][" + colindex + "] = " + v);
    if ( ri < 0 ) {
        return;
    }
    if ( colindex === "A" ) {
        lastHrange = extractFirstNumberFromString(v);
        return;
    }
    if ( colindex !== "B" ) {
        return;
    }

    var f;
    f = lookupTable.findOne({tableName: "h"});
    if ( !valid(f) ) {
        lookupTable.insert({tableName: "h", values: []});
        f = lookupTable.findOne({tableName: "h"});
    }
    if ( !valid(f) ) {
        return;
    }

    lastHvalues[ri] = {moneyStartValue: lastHrange, percent: v};
    lookupTable.update({_id: f._id}, {$set: {values: lastHvalues}});
}

var lastCHrange = 0;
var lastCHvalues = [];
var processCellCH = function(lookupTable, ri, colindex, v)
{
    //console.log("  - CH[" + ri + "][" + colindex + "] = " + v);
    if ( ri < 0 ) {
        return;
    }
    if ( colindex === "A" ) {
        lastCHrange = extractFirstNumberFromString(v);
        return;
    }
    if ( colindex !== "B" ) {
        return;
    }

    var f;
    f = lookupTable.findOne({tableName: "ch"});
    if ( !valid(f) ) {
        lookupTable.insert({tableName: "ch", values: []});
        f = lookupTable.findOne({tableName: "ch"});
    }
    if ( !valid(f) ) {
        return;
    }

    lastCHvalues[ri] = {moneyStartValue: lastCHrange, margin: v};
    lookupTable.update({_id: f._id}, {$set: {values: lastCHvalues}});
}

var lastIStartRange = 0;
var lastIColumnNames = [];
var processCellI = function(lookupTable, ri, colindex, v)
{
    //console.log("  - I[" + ri + "][" + colindex + "] = " + v);

    if ( ri < 0 ) {
        if ( ri == -1 ) {
            lastIColumnNames[colindex] = v;
        }
        return;
    }
    if ( colindex === "A" ) {
        lastIStartRange = extractFirstNumberFromString(v);
        return;
    }
    else {        
        var i;
        var p = null;
        for ( i in valuesI ) {
            if ( valuesI[i].startValue == lastIStartRange ) {
                p = valuesI[i];
                break;
            }
        }
        if ( !valid(p) ) {
            valuesI.push({startValue: lastIStartRange, discountArray: []});
            for ( i in valuesI ) {
                if ( valuesI[i].startValue == lastIStartRange ) {
                    p = valuesI[i];
                    break;
                }
            }
        }

        if ( !valid(valuesI[i]) ) {
            return;
        }

        var newcell = {provider: lastIColumnNames[colindex], discountPercent: v};
        valuesI[i].discountArray.push(newcell);
    }
}

var lastJrange = 0;
var lastJvalues = [];
var processCellJ = function(lookupTable, ri, colindex, v)
{
    //console.log("  - J[" + ri + "][" + colindex + "] = " + v);
    if ( ri < 0 ) {
        return;
    }
    if ( colindex === "A" ) {
        lastJrange = extractFirstNumberFromString(v);
        return;
    }
    if ( colindex !== "B" ) {
        return;
    }

    var f;
    f = lookupTable.findOne({tableName: "j"});
    if ( !valid(f) ) {
        lookupTable.insert({tableName: "j", values: []});
        f = lookupTable.findOne({tableName: "j"});
    }
    if ( !valid(f) ) {
        return;
    }

    lastJvalues[ri] = {moneyStartValue: lastHrange, percent: v};
    lookupTable.update({_id: f._id}, {$set: {values: lastJvalues}});    
}

var lastLMColumnNames = [];
var lastLMlabel = "unknown";
var processCellLM = function(lookupTable, ri, colindex, v, source)
{
    //console.log("  - " + source + "[" + ri + "][" + colindex + "] = " + v);

    if ( ri < 0 ) {
        if ( ri == -1 ) {
            lastLMColumnNames[colindex] = v;
        }
        return;
    }
    if ( colindex === "A" ) {
        lastLMlabel = v;
        return;
    }
    else {        
        var i;
        var p = null;
        for ( i in valuesLM ) {
            if ( valuesLM[i].stampLabel === lastLMlabel ) {
                p = valuesLM[i];
                break;
            }
        }
        if ( !valid(p) ) {
            valuesLM.push({stampLabel: lastLMlabel, pricesArray: []});
            for ( i in valuesLM ) {
                if ( valuesLM[i].stampLabel === lastLMlabel ) {
                    p = valuesLM[i];
                    break;
                }
            }
        }

        if ( !valid(valuesLM[i]) ) {
            return;
        }

        var vs = "" + v;
        if ( valid(v) && vs.indexOf("VER") == -1 ) {
            var newcell = {quantity: lastLMColumnNames[colindex], cost: v};
            valuesLM[i].pricesArray.push(newcell);            
        }

    }

}

var processCell = function(lookupTable, inTable, tableDataIndexStart, rowindex, colindex, v)
{
    var ri = (rowindex - tableDataIndexStart - 2);

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
        processCellLM(lookupTable, ri, colindex, v, "l");
        break;
      case "M":
        processCellLM(lookupTable, ri, colindex, v, "m");
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
    lookupTable.remove({});
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

    var lookupTable = global["lookupTable"];
    var f;
    lookupTable.insert({tableName: "g", values: []});
    f = lookupTable.findOne({tableName: "g"});
    if ( !valid(f) ) {
        return;
    }
    valuesG = [];

    var ti;
    lookupTable.insert({tableName: "i", values: []});
    ti = lookupTable.findOne({tableName: "i"});
    if ( !valid(ti) ) {
        return;
    }
    valuesI = [];

    var lm;
    lookupTable.insert({tableName: "lm", values: []});
    lm = lookupTable.findOne({tableName: "lm"});
    if ( !valid(lm) ) {
        return;
    }
    valuesLM = [];

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
            //console.log("COMENZANDO TABLA " + inTable);
            tableDataIndexStart = ri;
        }
        if ( valid(inTable) ) {
            processCell(lookupTable, inTable, tableDataIndexStart, rowindex, colindex, v);
        }
    }
    lookupTable.update(f._id, {$set: {values: valuesG}});
    lookupTable.update(ti._id, {$set: {values: valuesI}});
    lookupTable.update(lm._id, {$set: {values: valuesLM}});

    console.log("Importacion de categorias Ingenio finalizada");
}
