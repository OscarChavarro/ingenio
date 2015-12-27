/**
Esta función toma una dirección relativa de un recurso y calcula otra dirección
que puede ser relativa o absoluta dependiendo de la configuración del proyecto.

En entornos de desarrollo y pruebas, se cambia la url original para que ahora
apunte a la carpeta /original. Esto facilita el desarrollo a personal de
diseño gráfico y programación. En entornos de producción, esta función 
hace que el recurso se intente ubicar en la carpeta /optimized o en una
dirección absoluta que apunta a un repositorio distribuido de recursos
estáticos como el "Amazon Web Services Simple Storage Service" (AWS-S3).
*/
var usageMode = "staticOriginal";
//var usageMode = "staticDistributedS3";
resourceUrl = function(urlSegment) 
{
    var totalUrl;

    if ( usageMode == "staticDistributedS3" ) {
        totalUrl = "http://ingeniosp.s3.amazonaws.com/original" + urlSegment;
    }
    else {
        // Case "staticOriginal"
        totalUrl = "/original" + urlSegment;
    }
    return totalUrl;
}

/**
Versión usada para el envío de correos. 
*/
resourceUrlForMail = function(urlSegment)
{
    return "http://ingenio.cubestudio.co" + resourceUrl(urlSegment);
}

/**
Esta función se utiliza para tener acceso a las variables del método
GET cuando se usa el operador "?" en una URL, como
http://www.servidor.com/carpeta/archivo?parametro=valor&parametro2=valor2

Se retorna un arreglo con todos los parametros y valores, como
[{parametro: valor}, {parametro2:valor2}]
*/
accessGetParameters = function () {
    var _GET = {};
    var params = window.location.search;

    if (params.length > 1 || params.length <= 20) {
        params = "{\"" + params.substring(1, params.length) + "\"}";
        var re = new RegExp("&", 'g');
        params = params.replace(re, "\", \"");
        re = new RegExp("=", 'g');
        params = params.replace(re, "\":\"");
        if (params.toString().length <= 4) {
            return _GET;
        }
        _GET = JSON.parse(params);
    }
    return _GET;
}

/**
Esta función retorna false si el objeto es null o está
indefinido. Esta función es de uso común y fundamental en el proyecto
tanto del lado del cliente como del lado del servidor.
*/
valid = function (o) {
    if (o == null || typeof o === "undefined") {
        return false;
    }
    return true;
}

/**
Revisar cómo integrar una version JSON-stringifada.
*/
printObject = function (o) {
    if (o === null || typeof o === "undefined") {
        console.log("El objeto es indefinido!");
    }
    else if (typeof o === "object") {
        if (o.length < 1) {
            console.log("  * Objeto vacío");
        }
        else {
            console.log("* Objeto con los siguientes atributos:");
            for (var i in o) {
                console.log("  - " + i + ": " + o[i]);
            }
        }
    }
    else if (typeof o === "string" ||
        typeof o === "number") {
        console.log(o);
    }
    else {
        console.log("Objeto desconocido! Ver funcion printObject");
        console.log("  - tipo: " + typeof o);
    }
}

/**
Revisar cómo integrar una version JSON-stringifada.
*/
countNumberOfObjectAttributes = function (o) {
    if (o === null || typeof o === "undefined") {
        return 0;
    }
    else if (typeof o === "object") {
        if (valid(o.length)) {
            return o.length;
        }
        else {
            var count = 0;
            for (var i in o) {
                count++;
            }
            return count;
        }
    }
    else if (typeof o === "string" ||
        typeof o === "number") {
        return 1;
    }
    return 0;
}

/**
*/
formatNumber = function (number) {
    number = number.toFixed(2) + '';
    x = number.split('.');
    x1 = x[0];
    //x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 /*+ x2*/;
}

function XMLtoJSON() {
    var me = this;      // stores the object instantce

    // gets the content of an xml file and returns it in
    me.fromFile = function (xml, rstr) {
        // Cretes a instantce of XMLHttpRequest object
        var xhttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        // sets and sends the request for calling "xml"
        xhttp.open("GET", xml, false);
        xhttp.send(null);

        // gets the JSON string
        var json_str = jsontoStr(setJsonObj(xhttp.responseXML));

        // sets and returns the JSON object, if "rstr" undefined (not passed), else, returns JSON string
        return (typeof (rstr) == 'undefined') ? JSON.parse(json_str) : json_str;
    }

    // returns XML DOM from string with xml content
    me.fromStr = function (xml, rstr) {
        // for non IE browsers
        if (window.DOMParser) {
            var getxml = new DOMParser();
            var xmlDoc = getxml.parseFromString(xml, "text/xml");
        }
        else {
            // for Internet Explorer
            var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
        }

        // gets the JSON string
        var json_str = jsontoStr(setJsonObj(xmlDoc));

        // sets and returns the JSON object, if "rstr" undefined (not passed), else, returns JSON string
        return (typeof (rstr) == 'undefined') ? JSON.parse(json_str) : json_str;
    }

    // receives XML DOM object, returns converted JSON object
    var setJsonObj = function (xml) {
        var js_obj = {};
        if (xml.nodeType == 1) {
            if (xml.attributes.length > 0) {
                js_obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    js_obj["@attributes"][attribute.nodeName] = attribute.value;
                }
            }
        } else if (xml.nodeType == 3) {
            js_obj = xml.nodeValue;
        }
        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof (js_obj[nodeName]) == "undefined") {
                    js_obj[nodeName] = setJsonObj(item);
                } else {
                    if (typeof (js_obj[nodeName].push) == "undefined") {
                        var old = js_obj[nodeName];
                        js_obj[nodeName] = [];
                        js_obj[nodeName].push(old);
                    }
                    js_obj[nodeName].push(setJsonObj(item));
                }
            }
        }
        return js_obj;
    }

    // converts JSON object to string (human readablle).
    // Removes '\t\r\n', rows with multiples '""', multiple empty rows, '  "",', and "  ",; replace empty [] with ""
    var jsontoStr = function (js_obj) {
        var rejsn = JSON.stringify(js_obj, undefined, 2).replace(/(\\t|\\r|\\n)/g, '').replace(/"",[\n\t\r\s]+""[,]*/g, '').replace(/(\n[\t\s\r]*\n)/g, '').replace(/[\s\t]{2,}""[,]{0,1}/g, '').replace(/"[\s\t]{1,}"[,]{0,1}/g, '').replace(/\[[\t\s]*\]/g, '""');
        return (rejsn.indexOf('"parsererror": {') == -1) ? rejsn : 'Invalid XML format';
    }
};
