//= VARIABLES GLOBALES ==============================================
// Acceso a colecciones de la base de datos (comunes a cliente y a servidor)

language = new Mongo.Collection("language");

userRole = new Mongo.Collection("userRole");

user2role = new Mongo.Collection("user2role");

users = Meteor.users; // Equivalente a new Mongo.Collection("users"); pero dentro del package Meteor.users

productCategory = new Mongo.Collection("productCategory");

marPicoProduct = new Mongo.Collection("marPicoProduct");
marPicoCategory = new Mongo.Collection("marPicoCategory");

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
    friendlyUrl: {
        type: String,
        label: "URL Amigable",
        optional: false
    }
}));

product2category = new Mongo.Collection("product2category");

product2multimediaElement = new Mongo.Collection("product2multimediaElement");

multimediaElement = new FS.Collection("multimediaElement", {
    stores: [new FS.Store.FileSystem("multimediaElement", {
        maxTries: 3 //optional, default 5
    })],
    filter: {
        allow: {
            contentTypes: ['image/*'] //allow only images in this FS.Collection
        }
    }
});

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

productEquivalence = new Mongo.Collection("productEquivalence");

if (Meteor.isClient) {
    Session.set("globalSelectedLanguage", "Spa");
}

if (Meteor.isServer) {
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
}

product2user = new Mongo.Collection("product2user");
