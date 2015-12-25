/**
Versión helper global de la función resourceUrl definida en
/lib/commonClientServerCode/globalFunctions.js
*/
Template.registerHelper("resourceUrl", function(urlSegment)
        {
            return resourceUrl(urlSegment);
        }
);
