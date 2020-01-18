angular.module("phoneShopApp")
.filter("priceFilter", function()
{
	return (products, min, max) =>
	{
		if(angular.isArray(products) && angular.isNumber(min) && angular.isNumber(max))
		{
			return products.filter(product => product.priceUAH >= min && product.priceUAH <= max);
		}
		else
		{
			return products;
		}
	};

});