Meteor.startup(function () {
    Meteor.methods({
        /**
        Permite al usuario administrador de diseño gráfico cambiar el estilo visual (tema)
        actualmente seleccionado a nivel global para el sistema.
        */
        setCustomCss: function(pattern)
        {
            Inject.rawHead("customHeaderCss", '  <link rel="stylesheet" type="text/css" href="/original/stylesheets/' + pattern + '.css">');

            return "OK";
        },
        /**                                                                                                                                              
        Retorna en un arreglo el conjunto de perfiles de usuario disponibles                                                                             
        para el usuario dado.                                                                                                                            
        */
        getUserRoles: function(uid) {
            var user2role = global["user2role"];
            var userRole = global["userRole"];
            var arr = [];

            if ( valid(user2role) && valid(userRole) && valid(uid) ) {
                var set;
                set = user2role.find({userId: uid});
                if ( valid(set) ) {
                    var setarr;
                    setarr = set.fetch();
                    if ( valid(setarr) && valid(setarr.length) &&
                         setarr.length > 0 ) {
                        //console.log("Solicitando los roles del usuario " + uid);                                                                       
                        var i;
                        for ( i in setarr ) {
                            var r = userRole.findOne({_id: setarr[i].userRoleId});
                            if ( valid(r) ) {
                                arr.push({nameC: r.nameC});
                                //console.log("  - Rol: " + r.userRoleNameEng);                                                                          
                            }
                        }
                    }
                }
            }

            return arr;
        },
        /**                                                                                                                                              
        Hace el método "setPassword" del API Meteor para usuarios disponible                                                                             
        al lado del cliente.                                                                                                                             
        */
        setUserPassword: function(userId, newPassword) {
            Accounts.setPassword(userId, newPassword);
        }
    })
});
