var getLookupTables = function()
{
    var tables = Session.get("lookupTables");
    if ( valid(tables) ) {
        return tables;
    }
    Meteor.call("getLookupTables", null, function(e, v){
        if ( valid(e) ) {
            alert("Error obteniendo tablas de datos");
        }
        else if ( !valid(v.length) ) {
            alert("Error: no hay tablas de datos");
        }
        else {
            console.log("Tabla de datos:");
            console.log(v);
            Session.set("lookupTables", v);
        }
    });
    return null;
}

/**
Dado un nombre de tabla, se busca esa tabla en la lista de tablas. Si no
se encuentra se retorna null.
*/
var getLookupTable = function(tables, id)
{
    var i;

    if ( !valid(tables) ) {
        console.log("ERROR: No hay tablas");
        return null;
    }

    if ( !valid(id) ) {
        console.log("ERROR: No hay indice para tablas");
        return null;
    }

    for ( i in tables ) {
        if ( tables[i].tableName === id ) {
            return tables[i];
        }
    }
    return null;
}

var searchValIDiscountForProvider = function(tableI, i, provider)
{
    var j;
    var arr = tableI.values[i].discountArray;
    for ( j in arr ) {
        if ( arr[j].provider.indexOf(provider) >= 0 ) {            
            return arr[j].discountPercent;
        }
    }
    return 0;
}

/**
Dada una cantidad, busca el porcentaje de descuento basandose en la cantidad.
*/
var getQuantityDiscountFromIValue = function(tableI, quantity, provider)
{
    if ( !valid(tableI) ) {
        console.log("  * ERROR: No esta la tabla I");
        return 0;
    }
    if ( !valid(tableI.values) ) {
        console.log("  * ERROR: la tabla I esta mal:");
        console.log(tableI);
        return 0;
    }

    tableI.values.sort(function(a, b) {
        if ( a.startValue > b.startValue ) {
            return -1;
        }
        else if ( a.startValue < b.startValue ) {
            return 1;
        }
        return 0;
    });

    var prevDiscount = searchValIDiscountForProvider(tableI, 0, provider);
    var i;

    for ( i in tableI.values ) {
        prevDiscount = searchValIDiscountForProvider(tableI, i, provider);
        if ( quantity >= tableI.values[i].startValue ) {
            return prevDiscount;
        }
    }
    return 0;
}

var getMarginFromHValue = function(tableH, scale)
{
    if ( !valid(tableH) ) {
        console.log("  * ERROR: No esta la tabla H");
        return 0;
    }
    if ( !valid(tableH.values) ) {
        console.log("  * ERROR: la tabla H esta mal:");
        console.log(tableH);
        return 0;
    }

    tableH.values.sort(function(a, b) {
        if ( a.moneyStartValue > b.moneyStartValue ) {
            return -1;
        }
        else if ( a.moneyStartValue < b.moneyStartValue ) {
            return 1;
        }
        return 0;
    });

    var prevMargin = tableH.values[0].percent;
    var i;

    for ( i in tableH.values ) {
        prevMargin = tableH.values[i].percent;
        if ( scale >= tableH.values[i].moneyStartValue ) {
            return prevMargin;
        }
    }
    return 0;

}

/**
Esta es una de las dos subrutinas de control para casos de calculateInternalPrice
*/
var calculatePriceForUsbProduct = function(product, quantity, markIndex, lookupTables) {
    var varI;
    var tableI;

    tableI = getLookupTable(lookupTables, "i");
    if ( !valid(tableI) ) {
        varI = 0;
    }
    else {
        varI = getQuantityDiscountFromIValue(tableI, quantity, product.provider);
    }
    console.log("  - Valor I: " + varI);
    var varP5;

    varP5 = product.price * (1.0 - varI) * quantity;
    console.log("  - Valor P5*Q: $" + varP5);

    //----------------------------------------------------------
    var tableH;
    var varH;
    tableH = getLookupTable(lookupTables, "h");
    if ( !valid(tableH) ) {
        varH = 0;
    }
    else {
        varH = getMarginFromHValue(tableH, varP5);
    }
    console.log("  - Valor H: " + varH);


    return quantity * product.price + varI;
}

/**
Esta es una de las dos subrutinas de control para casos de calculateInternalPrice
*/
var calculatePriceForNonUsbProduct = function(product, quantity, markIndex, lookupTables) {
    return quantity * product.price + 2;   
}

/**
Esta es la funcion principal de ejecucion del modelo de precios
INGENIO. Actualmente se implementa el proceso definido por 
Manuel Lemes para el primer semestre de 2016. Refierase a la
documentacion interna de INGENIO para entender este proceso
paso a paso.

Notese que esta funcion depende de las tablas "lookupTables"
en la base de datos mongo, que se puede redefinir a partir
de Excel en un proceso de importacion de datos.
*/
calculateInternalPrice = function(product, quantity, markIndex)
{
    var lookupTables = getLookupTables();
    var price;

    if ( !valid(lookupTables) ) {
        return -1;
    }

    console.log("CALCULANDO MODELO DE PRECIO PARA PRODUCTO");
    console.log("  - Precio base: " + product.price);
    console.log("  - Cantidad: " + quantity);
    console.log("  - Lookup tables: " + lookupTables.length);
    console.log("  - Tipo de marca: " + markIndex);

    var i;
    var tablelm = getLookupTable(lookupTables, "lm");
    var j;
    if ( valid(tablelm) ) {
        for ( j in tablelm.values ) {
            if ( j == markIndex ) {
                console.log("  - Tipo de marca en tabla LM: " + tablelm.values[j].stampLabel);
                break;
            }
        }
    }  

    console.log("  - Es USB: " + product.isUsb);
    console.log("  - Proveedor: " + product.provider);

    if ( product.isUsb ) {
        return calculatePriceForUsbProduct(product, quantity, markIndex, lookupTables);
    }

    return calculatePriceForNonUsbProduct(product, quantity, markIndex, lookupTables);
}
