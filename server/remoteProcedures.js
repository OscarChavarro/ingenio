Meteor.startup(function () {
    Meteor.methods({
        /**
        */
        exportDatabaseToExcel(catId)
        {
            console.log("- EXPORTANDO A EXCEL -");
            return "Ok";
        },
        /**
        */
        getSubcategoriesByCategoryId(catId)
        {
            var productCategory = global["productCategory"];
            if ( !valid(productCategory) || !valid(catId) || catId === "null" ) {
                return null;
            }
            
            //var oid = "ObjectID(\"" + catId + "\")";
            var children = productCategory.find({parentCategoryId: catId}).fetch();
            console.log(children);
            return children;
        },
        /**
        */
        changeProductCategories: function(elementData)
        {
            var productCategory = global["productCategory"];

            if ( !valid(productCategory) ) {
                return;
            }

            root = productCategory.findOne({nameSpa: "/"});
            if ( !valid(elementData) || !valid(root) ) {
                return;
            }

            var myId = new Mongo.ObjectID(elementData.substring(10, 34));

            // Esto debe tener en cuenta varios casos:
            // 1. No se cambia a que el padre sea él mismo, para evitar dependencia circular
            //    (viene validado por las restricciones en el formulario)
            // 2. No se cambia a un padre que no sea de nivel 1
            //    (viene validado por las restricciones en el formulario)
            // 3. No se cambia al root
            //    (viene validado por las restricciones en el formulario)
            // 4. Si antes era nivel raíz y luego pasa a ser subcategoría... todos sus
            //    actuales hijos pasan a ser hijos de raíz
            if ( elementData.length < 37 ) {
                console.log("Voy a cambiar de categoría a " + myId + " a ROOT " + root._id);
                productCategory.update(myId, {$set: {parentCategoryId: root._id}});
            }
            else {
                var parentId = myId;
                myId = new Mongo.ObjectID(elementData.substring(46, 70));
                console.log("Voy a cambiar de categoría a " + myId + " a " + parentId);
                var childrenArray = productCategory.find({parentCategoryId: myId}).fetch();
                var i;
                for ( i in childrenArray ) {
                    console.log("  - Reasignando a root a " + childrenArray[i]._id);
                    productCategory.update(childrenArray[i]._id, {$set: {parentCategoryId: root._id}});
                }
                productCategory.update(myId, {$set: {parentCategoryId: parentId}});
            }
        },
        /**
        Retorna un arreglo con las categorías de nivel superior.
        */
        getRootProductCategoryId: function()
        {
            var productCategory = global["productCategory"];
            if ( !valid(productCategory) ) {
                return null;
            }
            var root = productCategory.findOne({nameSpa: "/"});
            if ( !valid(root) || !valid(root._id) ) {
                return null;
            }
            return root._id;
        },
        /**
        Retorna un arreglo con las categorías de nivel superior.
        */
        getTopLevelProductCategories: function()
        {
            var productCategory = global["productCategory"];
            if ( !valid(productCategory) ) {
                return null;
            }
            var root = productCategory.findOne({nameSpa: "/"});
            if ( !valid(root) || !valid(root._id) ) {
                return null;
            }
            var options =  {"sort" : [["nameSpa", "asc"]]};
            var dataset = productCategory.find({parentCategoryId: root._id}, options);
            return dataset.fetch();
        },
        /**
        Hace el método "setPassword" del API Meteor para usuarios disponible
        al lado del cliente.
        */
        setUserPassword: function(userId, newPassword) {
            Accounts.setPassword(userId, newPassword);
        },
        /**
        Dado un correo electrónico, esta función retorna el _id del usuario 
        si existe un usuario con dicho correo. Retorna false si no se
        encuentra.
        */
        testIfUserExistsByEmail: function(userEmail)
        {
            if ( !valid(userEmail) ) {
                return false;
            }
            var users = global["users"];

            if ( !valid(users) ) {
                return false;
            }

            var u = users.findOne({"profile.email": userEmail});
            if ( !valid(u) ) {
                return false;
            }

            return u._id;
        },
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
