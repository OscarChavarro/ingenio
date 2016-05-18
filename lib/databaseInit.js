//= VARIABLES GLOBALES ==============================================
// Acceso a colecciones de la base de datos (comunes a cliente y a servidor)
if ( Meteor.isServer ) {
    console.log("Starting MongoDB data access...");
}

language = new Mongo.Collection("language");
userRole = new Mongo.Collection("userRole");
user2role = new Mongo.Collection("user2role");
users = Meteor.users; // Equivalente a new Mongo.Collection("users"); pero dentro del package Meteor.users
marPicoProduct = new Mongo.Collection("marPicoProduct");
marPicoCategory = new Mongo.Collection("marPicoCategory");
product2category = new Mongo.Collection("product2category");
productEquivalence = new Mongo.Collection("productEquivalence");
product2user = new Mongo.Collection("product2user");
faqQuestions = new Mongo.Collection("faqQuestions");
lookupTable = new Mongo.Collection("lookupTable");

productCategory = new Mongo.Collection("productCategory");
productCategory.attachSchema(new SimpleSchema({
    nameSpa: {
        type: String,
        label: "Nombre de la Categoria",
        max: 125
    },
    parentCategoryId: {
        type: String,
        label: "ID de la Categoria Padre",
        max: 50,
        optional: true
    },
    friendlyUrl: {
        type: String,
        label: "URL Amigable",
        max: 75
    }
}));

product = new Mongo.Collection("product");
product.attachSchema(new SimpleSchema({
    supplierId: {
        type: String,
        label: "ID del Proveedor",
        max: 25
    },
    supplierReference: {
        type: String,
        label: "Referencia externa (del proveedor) del producto:",
        max: 20
    },
    internalIngenioReference: {
        type: String,
        label: "Referencia interna (de Ingenio) del producto:",
        max: 20
    },
    nameSpa: {
        type: String,
        label: "Nombre del Producto",
        max: 250
    },
    descriptionSpa: {
        type: String,
        label: "Descripción del Producto"
    },
    marPicoProductId: {
        type: Number,
        label: "Identificador MarPico"
    },
    price: {
        type: Number,
        label: "Precio",
        decimal: true
    },
    markingSupportedSpa: {
        type: String,
        label: "Marca soportada",
        optional: true
    },
    measures: {
        type: String,
        label: "Medidas",
        optional: true
    },
    printAreaSpa: {
        type: String,
        label: "Area de marcacion",
        optional: true
    },
    packingSpa: {
        type: String,
        label: "Empaque",
        optional: true
    },
    friendlyUrl: {
        type: String,
        label: "URL Amigable",
        optional: false
    },
    multimediaElementsArr: {
        type: [String],
        label: "Arreglo de elementos multimedia",
        optional: true
    },
    variantCodesArr: {
        type: [String],
        label: "Arreglo de variantes: codigos",
        optional: true
    },
    variantDescriptionsArr: {
        type: [String],
        label: "Arreglo de variantes: descripciones",
        optional: true
    },
    variantQuantitiesArr: {
        type: [String],
        label: "Arreglo de variantes: cantidades",
        optional: true
    }
}));

supplier = new Mongo.Collection("supplier");
supplier.attachSchema(new SimpleSchema({
    name: {
        type: String,
        label: "Nombre del Proveedor",
        max: 150
    },
    supplierBaseCode: {
        type: String,
        label: "Referencia Base del Proveedor",
        max: 25
    },
    contactNumber: {
        type: String,
        label: "Número de Contacto"
    },
    physicalAddress: {
        type: String,
        label: "Dirección"
    },
    email: {
        type: String,
        label: "Correo Electrónico"
    }
}));

if ( Meteor.isServer ) {
    Meteor.users.allow({
        "update": function (userId, doc) {
            return true;
        }
    });
    Meteor.users.allow({
        "remove": function (userId, doc) {
            return true;
        }
    });
    console.log("MongoDB data access started OK.");
}
