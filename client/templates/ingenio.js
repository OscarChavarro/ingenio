Session.setDefault('counter', 0);

Template.hello.helpers({
    counter: function () {
        return Session.get('counter');
    }
});

var requestCustomCssChange = function(pattern)
{
    Meteor.call("setCustomCss", pattern, function(err, res) {
        if ( valid(err) ) {
            alert("Error llamando a setCustomCss");
        }
        else if ( !valid(res) || res !== "OK" ) {
            alert("Error llamando a setCustomCss");
        }
        else {
            location.reload();
        }
    });
}

Template.hello.events({
    "click #add": function () {
        // increment the counter when button is clicked
        Session.set('counter', Session.get('counter') + 1);
    },
    "click #one": function () {
        requestCustomCssChange("one");
    },
    "click #two": function () {
        requestCustomCssChange("two");
    }
});
