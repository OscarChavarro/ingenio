var fs = Npm.require('fs');

var fail = function(response) {
    response.statusCode = 404;
    response.end();
};

var dataFile = function() {
    console.log("Enviando archivo para: ");
    console.log("  - Campaña:" + this.params.campaignId);
    console.log("  - Usuario:" + this.params.userId);
    var file = "/home/jedilink/usr/ingenio/campaigns/flyer001_02.jpg";

    var stat = null;
    try {
        stat = fs.statSync(file);
    } 
    catch (_error) {
        return fail(this.response);
    }

    this.response.writeHead(200, {
        "Content-Type": "image/jpeg",
        //"Content-Disposition": "attachment; filename=" + "custom.filename",
        "Content-Length": stat.size
    });

    // Pipe the file contents to the response
    fs.createReadStream(file).pipe(this.response);
};

//Router.route("/c/:campaignId/:userId", dataFile, {where: 'server'});
