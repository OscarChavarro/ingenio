var fs = Npm.require('fs');
var path = Npm.require('path');
var excel = Npm.require('xlsx');

var createWorkbookFromMarpicoData = function(excel)
{
    // Access database
    var marPicoProduct = global["marPicoProduct"];
    var marPicoCategory = global["marPicoCategory"];

    var cursor = marPicoProduct.find();

    console.log("Exporting to Excel: " + cursor.count());

    // 1. Create workbook
    var wb = {}
    wb.Sheets = {};
    wb.Props = {};
    wb.SSF = {};
    wb.SheetNames = [];

    // Create worksheet
    var ws = {}

    // Range will keep growing to fit complete data
    var range = {s: {c:0, r:0}, e: {c:0, r:0}};

    var row = 0;
    cursor.forEach(function(p) {
        console.log("  - Product: " + p.name);
        if ( range.e.r < row ) {
            range.e.r = row;
        }

        var column;
        var data = [];
        data.push(p._id);
        data.push(p.name);
        data.push(p.description);
        for ( column = 0; column != data.length; column++ ) {
            if ( range.e.c < column ) {
                range.e.c = column;
            }

            // Create cell object: .v is the actual data */
            var cell = { v: data[column] };
            if ( cell.v == null ) {
                continue;
            }

            // Determine the cell type
            if ( typeof cell.v === 'number' ) {
                cell.t = 'n';
            }
            else if ( typeof cell.v === 'boolean' ) {
                cell.t = 'b';
            }
            else {
                cell.t = 's';
            }

            // Write cell
            var cellIndex = excel.utils.encode_cell({c:column, r:row});
            ws[cellIndex] = cell;
        }
        row++;
    });
    ws['!ref'] = excel.utils.encode_range(range);

    // Add worksheet to workbook
    wb.SheetNames.push("Ingenio");
    wb.Sheets["Ingenio"] = ws;
    return wb;
}

Meteor.startup(function () {
    Meteor.methods({
        /**
        */
        exportDatabaseToExcel(catId)
        {
            console.log("- EXPORTANDO A EXCEL -");
            var path = "c:/home/tmp";
            var workbook;
            workbook = createWorkbookFromMarpicoData(excel);
            console.log("Nombre de hoja " + workbook.SheetNames[0]);
            excel.writeFile(workbook, path + "/test.xlsx");
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
