Template.productCategoryIndexList.helpers({
	dbProductCategories: function()
	{
		return Session.get("topLevelProductCategoriesArray");
	}
});
