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
