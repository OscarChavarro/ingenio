Router.route("/exportDatabaseToExcel", {
    name: "exportDatabaseToExcel"
});

Template.exportDatabaseToExcel.events({
    "click #exportToExcelButton": function(event, template) {
        console.log("TUN");
        event.preventDefault();
        Meteor.call("exportDatabaseToExcel", null, function(e, r){
            if ( valid(e) ) {
                alert("Error en invocación");
            }
            else if ( valid(r) ) {
                alert("Listo el pollo");
            }
        });
    }
});
