var excel = Npm.require('xlsx');

Meteor.startup(function () {
    Meteor.methods({
        /**
        */
        getProductImageSetFromFriendlyUrl(productFriendlyUrl) {
            var product = global["product"];

            if (!valid(product)) {
                return { u: productFriendlyUrl, a: null, s: "No se puede conectar a la base de datos" };
            }

            var p;
            p = product.findOne({ friendlyUrl: productFriendlyUrl });
            if (!valid(p) || !valid(p.multimediaElementsArr)) {
                return { u: productFriendlyUrl, p: null, s: "No encuentra un producto cuya URL es " + productFriendlyUrl };
            }

            var i;
            var imgs = [];
            for (i in p.multimediaElementsArr) {
                imgs.push({ u: p.multimediaElementsArr[i] });
            }
            return { u: productFriendlyUrl, a: imgs, s: "Ok" };

            /*
            var product2multimediaElement = global["product2multimediaElement"];
            var multimediaElement = global["multimediaElement"];

            if ( !valid(product) || !valid(product2multimediaElement) ||
                 !valid(multimediaElement) ) {
                return {u: productFriendlyUrl, a: null, s: "No se puede conectar a la base de datos"};
            }

            var p;
            p = product.findOne({ friendlyUrl: productFriendlyUrl });
            if ( !valid(p) ) {
                return {u: productFriendlyUrl, p: null, s: "No encuentra un producto cuya URL es " + productFriendlyUrl};
            }

            var i = 0;
            var p2m = product2multimediaElement.find({ productId: p._id });
            var imgs = [];
            p2m.forEach(function (element, index, array) {
                var img = multimediaElement.findOne({ _id: element.multimediaElementId });
                imgs.push({u: img.url()});
            });
            return {u: productFriendlyUrl, a: imgs, s: "Ok"};
            */
        },
        /**
        */
        getProductFromFriendlyUrl(productFriendlyUrl) {
            var product = global["product"];
            var product2category = global["product2category"];

            if (!valid(product) || !valid(product2category)) {
                return { u: productFriendlyUrl, p: null, s: "No se puede conectar a la base de datos" };
            }

            var p;
            p = product.findOne({ friendlyUrl: productFriendlyUrl });

            if (!valid(p)) {
                return { u: productFriendlyUrl, p: null, s: "No encuentra un producto cuya URL es " + productFriendlyUrl };
            }

            p.supplierId = supplier.findOne({ _id: p.supplierId });
            p.categories = [];
            var p2c = product2category.find({ productId: p._id }).fetch();
            p2c.forEach(function (element, index, array) {
                if (element.categoryId) {
                    p.categories.push(productCategory.findOne({ _id: element.categoryId }));
                }
            });

            return { u: productFriendlyUrl, p: p, s: "Ok" };
        },
        /**
        Dada la direccion amigable "furl" para una categoria, este metodo retorna
        un arreglo con los productos de esa categoria.
        */
        getProductIndexArrayForCategoryFriendlyUrl: function (furl) {
            // Data access
            var productCategory = global["productCategory"];
            var product2category = global["product2category"];
            var product = global["product"];
            //var product2multimediaElement = global["product2multimediaElement"];
            //var multimediaElement = global["multimediaElement"];

            // Query over categories
            var c = productCategory.findOne({ friendlyUrl: "" + furl });

            var array = [];
            if (valid(c)) {
                var categories = [];
                //Check if specified category belongs to the root (is category) or not (is sub-category)
                if (c.parentCategoryId == productCategory.findOne({ nameSpa: "/" })._id) {
                    categories.push(c);
                    var subcategories = productCategory.find({ parentCategoryId: c._id }).fetch();
                    subcategories.forEach(function (item) {
                        categories.push(item);
                    });
                } else {
                    categories.push(c);
                }
                if (valid(categories)) {
                    categories.forEach(function (item) {
                        //console.log("  - Buscando productos para la categoria " + item._id);
                        var cursorp2c = product2category.find({ categoryId: item._id }).fetch();
                        cursorp2c.forEach(function (p2c) {
                            var p = product.findOne({ _id: p2c.productId });
                            var pn = "[Nombre desconocido]";
                            var pp = "?";
                            var fu = "ING176";
                            if (valid(p)) {
                                pn = p.nameSpa;
                                pp = "$" + p.price;
                                fu = p.friendlyUrl;
                            }

                            var imageUrl;

                            // Old version based on CFS module
                            //var p2me;
                            //p2me = product2multimediaElement.findOne({productId: p._id});
                            // No deberia ser esta si no una de "no hay imagen"
                            // imageUrl = "/cfs/files/multimediaElement/DkZG89qAKkkpThxMG/21021_3018967.jpg";
                            //if ( valid(p2me) ) {
                            //    var me;
                            //    me = multimediaElement.findOne({_id: p2me.multimediaElementId});
                            //    if ( valid(me) ) {
                            //        imageUrl = "/cfs/files/multimediaElement/" + me._id + "/" + 
                            //            me.copies.multimediaElement.name;
                            //    }
                            //}

                            imageUrl = "/original/productImages/" + p.multimediaElementsArr[0];

                            array.push({
                                i: imageUrl,
                                n: pn,
                                u: fu,
                                p: pp
                            });
                        });
                    });
                }
            }

            //console.log("  - Retornando arreglo para la categoria " + furl);
            //console.log("  - Elementos en el arreglo: " + array.length);
            return { catFriendlyUrl: furl, array: array };
        },
        /**
        */
        exportDatabaseToExcel: function (catId) {
            console.log("- EXPORTANDO A EXCEL -");
            var path = "/tmp";
            var workbook;
            workbook = createWorkbookFromMarpicoData(excel);
            console.log("Nombre de hoja " + workbook.SheetNames[0]);
            excel.writeFile(
                workbook,
                path + "/testWithFormat.xlsx",
                { bookSST: true });
            return "Ok";
        },
        /**
        */
        getSubcategoriesByCategoryId: function (catId) {
            var productCategory = global["productCategory"];
            if (!valid(productCategory) || !valid(catId) || catId === "null") {
                return null;
            }
            
            //var oid = "ObjectID(\"" + catId + "\")";
            var children = productCategory.find({ parentCategoryId: catId }).fetch();
            return { menuName: "menu_" + catId, children: children };
        },
        /**
        */
        changeProductCategories: function (elementData) {
            var productCategory = global["productCategory"];

            if (!valid(productCategory)) {
                return;
            }

            root = productCategory.findOne({ nameSpa: "/" });
            if (!valid(elementData) || !valid(root)) {
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
            if (elementData.length < 37) {
                console.log("Voy a cambiar de categoría a " + myId + " a ROOT " + root._id);
                productCategory.update(myId, { $set: { parentCategoryId: root._id } });
            }
            else {
                var parentId = myId;
                myId = new Mongo.ObjectID(elementData.substring(46, 70));
                console.log("Voy a cambiar de categoría a " + myId + " a " + parentId);
                var childrenArray = productCategory.find({ parentCategoryId: myId }).fetch();
                var i;
                for (i in childrenArray) {
                    console.log("  - Reasignando a root a " + childrenArray[i]._id);
                    productCategory.update(childrenArray[i]._id, { $set: { parentCategoryId: root._id } });
                }
                productCategory.update(myId, { $set: { parentCategoryId: parentId } });
            }
        },
        /**
        Retorna un arreglo con las categorías de nivel superior.
        */
        getRootProductCategoryId: function () {
            var productCategory = global["productCategory"];
            if (!valid(productCategory)) {
                return null;
            }
            var root = productCategory.findOne({ nameSpa: "/" });
            if (!valid(root) || !valid(root._id)) {
                return null;
            }
            return root._id;
        },
        /**
        Retorna un arreglo con las categorías de nivel superior.
        */
        getTopLevelProductCategories: function () {
            var productCategory = global["productCategory"];
            if (!valid(productCategory)) {
                return null;
            }
            var root = productCategory.findOne({ nameSpa: "/" });
            if (!valid(root) || !valid(root._id)) {
                return null;
            }
            var options = { "sort": [["nameSpa", "asc"]] };
            var dataset = productCategory.find({ parentCategoryId: root._id }, options);
            return dataset.fetch();
        },
        /**
        Hace el método "setPassword" del API Meteor para usuarios disponible
        al lado del cliente.
        */
        setUserPassword: function (userId, newPassword) {
            Accounts.setPassword(userId, newPassword);
        },
        /**
        Dado un correo electrónico, esta función retorna el _id del usuario 
        si existe un usuario con dicho correo. Retorna false si no se
        encuentra.
        */
        testIfUserExistsByEmail: function (userEmail) {
            if (!valid(userEmail)) {
                return false;
            }
            var users = global["users"];

            if (!valid(users)) {
                return false;
            }

            var u = users.findOne({ "profile.email": userEmail });
            if (!valid(u)) {
                return false;
            }

            return u._id;
        },
        /**
        Permite al usuario administrador de diseño gráfico cambiar el estilo visual (tema)
        actualmente seleccionado a nivel global para el sistema.
        */
        setCustomCss: function (pattern) {
            Inject.rawHead("customHeaderCss", '  <link rel="stylesheet" type="text/css" href="/original/stylesheets/' + pattern + '.css">');

            return "OK";
        },
        /**                                                                                                                                              
        Retorna en un arreglo el conjunto de perfiles de usuario disponibles                                                                             
        para el usuario dado.                                                                                                                            
        */
        getUserRoles: function (uid) {
            var users = global["users"];
            var arr = [];

            if (valid(users)) {
                var u;
                u = users.findOne({ _id: uid });
                if (valid(u) && valid(u.profile)) {
                    var setarr = u.profile.roles;
                    if (valid(setarr) && valid(setarr.length) &&
                        setarr.length > 0) {
                        return setarr;
                    }
                }
            }

            return arr;
        },
        /**                                                                                                                                              
        Hace el método "setPassword" del API Meteor para usuarios disponible                                                                             
        al lado del cliente.                                                                                                                             
        */
        setUserPassword: function (userId, newPassword) {
            Accounts.setPassword(userId, newPassword);
        },
        /**
        */
        importMarpicoProducts() {
            return importMarPicoCollectionsToIngenioCollections();
        },
        /*
        */
        deleteShoppingCart: function () {
            try {
                product2user.remove({ userId: Meteor.userId() });
                return true;
            } catch (ex) {
                return false;
            }

        },
        getShoppingCart: function (userId) {
            console.log(userId);
            var products = product2user.find({ userId: userId }).fetch();
            console.log(products);
            if (valid(products)) {
                for (var i = 0; i < products.length; i++) {
                    products[i].productId = product.findOne({ _id: products[i].productId });
                }
            } else {
                return [];
            }
            return products;
        },
        isProductInShoppingCart: function (product) {
            if (valid(product)) {
                return (valid(product2user.findOne({ productId: product._id, userId: Meteor.userId() })));
            } else {
                return true;
            }
        },
        getCategoryForCategoryId: function (categoryFriendlyUrl) {
            return productCategory.findOne({ friendlyUrl: categoryFriendlyUrl });
        }
    })
});
