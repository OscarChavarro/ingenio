//============================================================================
/**
*/
Router.route("/adminPanel", {
    name: "adminPanel",
    loadingTemplate: "adminPanelLoading",
    data: function () {
        // Variables globales con alcance a este módulo
        return true;
    }
    /*,
    waitOn: function() {
        testHandle = Meteor.subscribe("test");
        return testHandle;
    }
    */
});

//============================================================================
