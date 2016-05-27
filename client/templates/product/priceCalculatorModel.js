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
    for ( i in lookupTables ) {
        if ( lookupTables[i].tableName === "lm" ) {
            console.log("  - TablaLM: OK");
            var j;
            for ( j in lookupTables[i].values ) {
                if ( j == markIndex ) {
                    console.log("  - Tipo de marca en tabla LM: " + lookupTables[i].values[j].stampLabel );
                    break;
                }
            }
            break;
        }
    }

    console.log("  - Es USB: " + product.isUsb);
    console.log("  - Proveedor: " + product.provider);

    return quantity * product.price;
}
