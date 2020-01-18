angular
.module("phoneShopApp", [])
.directive("cartShow", function() 
{
    return {
        template: function() {
            return angular.element(document.querySelector("#cartTemplate")).html();
        },
        restrict: "A",
        scope: true
    };
})

.controller("viewPhonesCtrl", function ($scope, $http) 
{          
    let getData = function(url)
    {
        $http.get(url)
         .then(function(response) {
            let products = response.data;
            for(let i = 0; i < products.length; i++)
            {
                products[i].priceUAH = parseInt(products[i].priceUAH, 10);
                products[i].countProducts = parseInt(products[i].countProducts, 10);
                products[i].numSimCard = parseInt(products[i].numSimCard, 10);
            }
            $scope.products = response.data;
            $scope.$emit("getProductsEvent", 
            {
                message: $scope.products,
                imagesUrl: $scope.imagesUrl
            });
        });                        
    };
    // завантаження каталогу
    getData("http://apeps.kiev.ua/post/getphones");
    $scope.imagesUrl = "http://apeps.kiev.ua/images/phones";
    
    if($scope.products == undefined || $scope.products.length < 1)
    {
        getData("../images/data.json");
        $scope.imagesUrl = "../images";
    }
})

.controller("cartCtrl", function ($scope, $rootScope) 
{
    $scope.selectedPhones = new Array();                
    // Додати телефон в кошик
    $scope.buyButtonClick = (product) =>
    {
        let index = $scope.selectedPhones.map((e)=> e.id).indexOf(product.id);
        if(index > -1)
        {
            $scope.selectedPhones[index].count++;
        }
        else
        {
            product.count = 1;                        
            $scope.selectedPhones.push(product);
        }

        $scope.getTotalPrice();
        $scope.saveCart(); 
    };

    // Видалити телефон з кошика
    $scope.deleteButtonClick = (product) =>
    {
        
        let index = $scope.selectedPhones.indexOf(product);
        $scope.selectedPhones[index].count--;
        if($scope.selectedPhones[index].count <= 0)
        {
            $scope.selectedPhones.splice(index, 1);
        }
        $scope.getTotalPrice();
        $scope.saveCart();
    };  

    // Розрахунок загальної вартості всіх покупок
    $scope.getTotalPrice = () =>
    {
        $scope.totalPrice = 0;
        $scope.selectedPhones.forEach( function(phone) {
            $scope.totalPrice += phone.count * parseInt(phone.priceUAH, 10);
        });
    };

    // Зерегти кошик
    $scope.saveCart = ()=>
    {
        window.localStorage.setItem("cart", JSON.stringify($scope.selectedPhones));
    };

    // Завантажити кошик
    $scope.loadCart = () =>
    {
        let cartStr = window.localStorage.getItem("cart");
        if(cartStr == null || cartStr == "") return;
        $scope.selectedPhones = JSON.parse(cartStr); 
        $scope.getTotalPrice();
    };
    //$scope.loadCart();

    // Замовлення
    $scope.orderButtonClick = () => {
        $rootScope.$broadcast("orderEvent", 
        {
            selectedPhones: $scope.selectedPhones,
            totalPrice: $scope.totalPrice,
            imagesUrl: $scope.imagesUrl
        });
    };

    // Зробити кнопку недоступною, якщо телефон відсутній
    $scope.isDisabled = (product) =>
    {
        let result = product.countProducts == 0;
        let currPhone = $scope.selectedPhones.find(p => product.id == p.id);
        if(currPhone != undefined)
        {
            let countProducts = currPhone.countProducts;
            result = result || product.count == countProducts;
        }                    
        
        $(`#buyButton${product.id}`)
            .text(result ? "Відсутні" : "Купити");
        $(`#buyButton${product.id}`)
            .prop("disabled", result);
        $(`#addButton${product.id}`)
            .prop("value", result ? "Відсутні" : "Додати");
        return result;
    };                
})

.controller("phonesOrderCtrl", function ($scope) 
{
    $scope.phonePattern = new RegExp("^[\+]?[0-9]+$");
    // $scope.cardIdPattern = new RegExp("^[0-9]+$");
    // $scope.cardCvvPattern = new RegExp("^[0-9]+$");
    $scope.payTypes = ["Готівкою", "Карткою"];
    $scope.selectedPayType = $scope.payTypes[0];
    $scope.user = 
    {
        name:"",
        surname:"",
        phone:"",
        email:"",                    
        card: {
            id1:"", id2:"", id3:"", id4:"",
            id:"",
            cvv:"",
            date: new Date()
        }
    };

    $scope.monthes = [];
    for(let i = 0; i < 12; i++)
    {
        $scope.monthes.push(i + 1);
    }

    $scope.user.card.month = $scope.monthes[0];
    
    $scope.years = [];
    for(let i = 0; i < 5; i++)
    {
        let year = new Date();
        year = year.getFullYear();

        $scope.years.push(year - i);
    }
    $scope.user.card.year = $scope.years[0];

    $scope.$on("orderEvent", (event, args) => 
    {
        $scope.selectedPhones = args.selectedPhones;
        $scope.totalPrice = args.totalPrice;
        $scope.imagesUrl = args.imagesUrl;
    });

    // Додати замовлення
    $scope.addOrder = () =>
    {  
        $scope.user.card.id = `${$scope.user.card.id1}${$scope.user.card.id2}${$scope.user.card.id3}${$scope.user.card.id4}`;
        $scope.user.card.date =  `${$scope.user.card.month}.${$scope.user.card.year}`;
    };

    // Обробка помилок
    $scope.getError = (error) =>
    {
        if (angular.isDefined(error)) {
            if (error.required) {
                return "Поле не повинно бути порожнім";
            } else if (error.email) {
                return "Вкажіть правильний email";
            }  else if (error.minlength) {
                return "Недостатня кількість символів";
            } else if (error.maxlength) {
                return "Перевищено допустиму довжину";
            } else if (error.pattern) {
                return "Недопустимий формат даних";
            }
        }
    };

    // // Форматований вивід дати
    // $scope.getUserCardDate = () =>
    // {
    //     let date = $scope.user.card.date;
    //     return `${$scope.user.card.month}.${$scope.user.card.year}`;
    // };

    // Перевірка номера
    $scope.checkPhoneNumber = (event) =>
    { 
        let pattern = new RegExp("^\\d+$");
        if (pattern.test(event.key) == false) {
            if(($scope.user.phone == "" || $scope.user.phone == undefined) && event.key == "+")
                return;
            event.preventDefault();
        }
    }

    // Перевірка числових полів
    $scope.isNumberKey = function(event, idPart, maxLength)
    {        
                
        let pattern = new RegExp("^\\d+$");
        if (pattern.test(event.key) == false)
            event.preventDefault();
        console.log($scope.user);
        if(angular.isDefined(idPart) &&
            String(idPart).length >= maxLength)
            event.preventDefault();
    };

    $scope.checkIdPart = function(event, idPart)
    {  
        let maxLength = 4;
        $scope.isNumberKey(event, idPart, maxLength);
    };

    $scope.checkCvv = function(event)
    {  
        let maxLength = 3;
        $scope.isNumberKey(event, $scope.user.card.cvv, maxLength);
    };

    $scope.changeFocus = function(idPart, nextIndex)
    {
        if(String(idPart).length == 4)
        {   
            angular.element($(`[tabindex=${nextIndex}]`)).focus();
        }
    };
})

.controller("filterCtrl", function ($scope, $filter) 
{
    $scope.sortFields = [
        {key: "назві", value: "productName"},
        {key: "ціні", value: "priceUAH"},
        {key: "бренду", value: "brandName"}
    ];
    $scope.selectedField = $scope.sortFields[0];
    $scope.sortMethods = [
        {key: "за збільшенням", value: "+"},
        {key: "за зменшенням", value: "-"}
    ];
    $scope.selectedMethod = $scope.sortMethods[0];            

    $scope.sortFilterChange = () =>
    {
        $scope.orderByParam = `${$scope.selectedMethod.value}${$scope.selectedField.value}`;
    };
    $scope.sortFilterChange();
    
    $scope.brands = [];
    $scope.operationSystems = [];
    let priceSlider;

    $scope.$on("getProductsEvent", (event, args) => {
        $scope.products = args.message;
        $scope.imagesUrl = args.imagesUrl;
        $scope.filteredProducts = $scope.products;
        $scope.brands = $scope.products.map( p => p.brandName);
        $scope.brands = [...new Set($scope.brands)];
        $scope.brands = $scope.brands.map((b) => 
        {
            return {name: b, selected: true};
        });

        $scope.operationSystems = $scope.products.map( p => p.operationSystem);
        $scope.operationSystems = [...new Set($scope.operationSystems)];
        $scope.operationSystems = $scope.operationSystems.map((os) => 
        {
            return {name: os, selected: true};
        });                    
        
        $scope.getPriceRange();

        priceSlider = new Slider('#priceSlider', 
        {
            min: $scope.priceRange.min,
            max: $scope.priceRange.max,
            value: [$scope.priceRange.min, $scope.priceRange.max]
        });

        priceSlider.on("slideStop", function(event) {
            $scope.$apply(()=>
            {
                $scope.priceRange.min = priceSlider.getValue()[0];
                $scope.priceRange.max = priceSlider.getValue()[1];
            });
        });

        $scope.$watch('filteredProducts', function() 
        {
            $scope.getPriceRange();
            priceSlider.setValue([$scope.priceRange.min, $scope.priceRange.max]);
        }, true);
        
    });

    $scope.getPriceRange = () =>
    {                    
        if(angular.isDefined($scope.filteredProducts) != true) return;
        $scope.priceRange = 
        {
            min:$scope.filteredProducts[0].priceUAH, 
            max:$scope.filteredProducts[0].priceUAH
        };
        $scope.filteredProducts.forEach(product =>
        {
            if($scope.priceRange.min > product.priceUAH)
                $scope.priceRange.min = product.priceUAH;
            if($scope.priceRange.max < product.priceUAH)
                $scope.priceRange.max = product.priceUAH;
        });
    };

    $scope.filterByBrands = (product) =>
    {
        let brands = 
            $scope.brands
                .filter(b => b.selected == true)
                .map(b => b.name);
        return brands.indexOf(product.brandName) != -1;
    };

    $scope.filterByOs = (product) =>
    {
        let operationSystems = 
            $scope.operationSystems
                .filter(os => os.selected == true)
                .map(os => os.name);
        return operationSystems.indexOf(product.operationSystem) != -1;
    };

    $scope.filterAvailableBrands = (brand) =>
    {
        let operationSystems = 
            $scope.operationSystems
                .filter(os => os.selected == true)
                .map(os => os.name);
        let phones = $filter('filter')($scope.products, $scope.filterByOs);
        return phones.filter(p => p.brandName == brand.name).length > 0;
    };                
});