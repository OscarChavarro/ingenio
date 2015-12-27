
Router.route("/operatorAdminPanel", {
    name: "operatorAdminPanel",
    loadingTemplate: "operatorAdminPanelLoading",
    data: function() {
        Session.setDefault("counter", 0);
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

Template.operatorAdminPanel.helpers({
    counter: function () {
        return Session.get('counter');
    }
});

Template.operatorAdminPanel.events({
    "click #add": function () {
        // increment the counter when button is clicked
        Session.set('counter', Session.get('counter') + 1);
    },
    "click #one": function () {
        event.preventDefault();
        requestCustomCssChange("one");
    },
    "click #two": function () {
        event.preventDefault();
        requestCustomCssChange("two");
    },
    "click #postMethod": function (event) {
        event.preventDefault();
        Meteor.http.call("POST", "/forwardMandrillIncomingMail", "Test data", 
            function(error, result) {
                if ( valid(error) ) {
                    console.log("Hay error: " + error);
                }
                else if ( valid(result) && valid(result.content) ) {
                    console.log("Listo, resultado: " + result.content);
                }
                else {
                    console.log("No hay resultado");
                }
            }
        );
    }
});
