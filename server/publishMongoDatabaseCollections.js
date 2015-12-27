Meteor.publish(
    "language", function() {
        return language.find();
    }
);
