Meteor.startup(function () {
    Meteor.methods({
        /**
        */
        setCustomCss: function(pattern)
        {
        	Inject.rawHead("customHeaderCss", '  <link rel="stylesheet" type="text/css" href="/original/stylesheets/' + pattern + '.css">');

            return "OK";
        }
    })
});
