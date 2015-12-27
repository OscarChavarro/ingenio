console.log("Publicando colecciones MongoDB a Minimongo");

Meteor.publish(
    "allUsers", function() {
        return Meteor.users.find({});
    }
);

Meteor.publish(
    "language", function() {
        return language.find();
    }
);

Meteor.publish(
    "userRole", function() {
        return userRole.find();
    }
);

Meteor.publish(
    "user2role", function() {
        return user2role.find();
    }
);
