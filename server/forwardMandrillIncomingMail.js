Router.map(function () 
{
    this.route("forwardMandrillIncomingMail", {
        path: "/forwardMandrillIncomingMail",
        where: "server",
        action: function()
        {
            console.log('- POST METHOD CALLED FOR forwardMandrillIncomingMail -----------------------------');

            this.response.writeHead(200, {
                    "Content-Type": "text/html",
                    "Access-Control-Allow-Origin": "*"
            });

            if ( this.request.method == "POST" ) {
                console.log(this.request.body);
            }
            this.response.end("success");
        }
    });
});
