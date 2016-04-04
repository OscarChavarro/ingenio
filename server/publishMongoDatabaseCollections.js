console.log("Publicando colecciones MongoDB a Minimongo");

Meteor.publish(
    "allUsers", function () {
        return Meteor.users.find({});
    }
    );

Meteor.publish(
    "language", function () {
        return language.find();
    }
    );

Meteor.publish(
    "userRole", function () {
        return userRole.find();
    }
    );

Meteor.publish(
    "user2role", function () {
        return user2role.find();
    }
    );

Meteor.publish(
    "productCategory", function () {
        return productCategory.find();
    }
    );

Meteor.publish(
    "product2category", function () {
        return product2category.find();
    }
    );

Meteor.publish(
    "supplier", function () {
        return supplier.find();
    }
    );

Meteor.publish(
    "multimediaElement", function () {
        return multimediaElement.find();
    }
    );

Meteor.publish(
    "product2multimediaElement", function () {
        return product2multimediaElement.find();
    }
    );

Meteor.publish(
    "product", function () {
        return product.find();
    }
    );

Meteor.publish(
    "productEquivalence", function () {
        return productEquivalence.find();
    }
    );

Meteor.publish(
    "product2user", function (userId) {
        return product2user.find({ userId: userId });
    }
    );