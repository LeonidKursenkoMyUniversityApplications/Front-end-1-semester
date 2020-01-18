
let selectedPhones = new Array();
let imagesUrl = "";

// загрузка
$(function()
{
    getData();
});

// завантаження каталогу
function getData()
{
    $.ajax(
    {
        url: "http://apeps.kiev.ua/post/getphones",
        success: function(data)
        { 
        	imagesUrl = "http://apeps.kiev.ua/images/phones";
            prepareData(data);
        },
        error: function()
        {
        	imagesUrl = "../images";
        	prepareData(jsonData);
        }, 
        complete: function()
        {                	
            loadCart();           
            let cartButton = $(`#cartButton`).click(() =>
            {
                $(`#cartModal`).modal('show');
            });
        }
    });
}

function prepareData(data)
{
	products = JSON.parse(data);
    products.forEach(viewProduct);
    $(`.grid`).imagesLoaded(function()
    {
        $(`.grid`).masonry(
        {
            itemSelector: '.grid-item'
        });
        $(`img`).imagezoomsl(
        { 
            zoomrange: [1, 2],
            zoomstart: 3,
            innerzoom: true,
            magnifierborder: "none"
        });
    });
}

// Вивід продукти
function viewProduct(product)
{
    $(`<div id="product${product.id}" class="grid-item grid-border"></div`)
        .appendTo("#productsView")
        .append(`<p class="productName">${product.productName}</p>`)
        .append(`<img src="${imagesUrl}/${product.id}.jpg"
        data-large="${imagesUrl}/${product.id}.jpg"
        data-text-bottom="${product.productName}" alt="" />`)
        .append(`<p>Бренд: ${product.brandName}</p>`)
        .append(`<p>ОС: ${product.operationSystem}</p>`)
        .append(`<p>Кількість сім карт: ${product.numSimCard}</p>`)
        .append(`<div id="rating${product.id}" class="rating"></div>`)
        .append(`<p class="rating">Рейтинг: ${product.productRate}</p>`)
        .append(`<p class="countViews center">Кількість переглядів: ${product.countViews}</p>`)
        .append(`<p class="price">Ціна: ${product.priceUAH} грн</p>`)
        .append(`<input id="buyButton${product.id}" type="button" class="buyButton" value="Купити" />`);
    if(product.countProducts == 0) 
        $(`#buyButton${product.id}`)
            .prop(`disabled`, true)
            .val(`Відсутні`);

    $(`#buyButton${product.id}`).click(function()
    {
        addProductToCart(product);
    });

    // Рейтинг задається зірками
    $(`#rating${product.id}`).rateYo(
    {
      rating: product.productRate,
      numStars: 5,
      multiColor: { 
          "startColor": "#FF0000", //RED
          "endColor"  : "#00FF00"  //GREEN
        },
      readOnly: true
    })
}

// Додати телефон в кошик
function addProductToCart(product)
{
    let index = selectedPhones.map((e)=> e.id).indexOf(product.id);
    if(index > -1)
    {
        product.count++;   
        $(`.productsTable tr`).eq(index + 1).children().eq(3).html(product.count);
    }
    else
    {
        product.count = 1;
        selectedPhones.push(product);
        index = selectedPhones.indexOf(product);
        $(`<tr>
            <td>${index + 1}</td>
            <td><img src="${imagesUrl}/${product.id}.jpg" alt="" /></td>
            <td>${product.productName}</td>
            <td>${product.count}</td>
            <td>${product.priceUAH} грн</td>
            <td><input id="addButton${product.id}" type="button" class="buyButton" value="Додати" /></td>
            <td><input id="deleteButton${product.id}" type="button" class="deleteButton" value="Видалити" /></td>
        </tr>`)
        .insertBefore($(`.totalRow`));

        $(`#addButton${product.id}`).click(function(e)
        {
            addProductToCart(product);
        });

        $(`#deleteButton${product.id}`).click(function(e)
        {
            
            index = selectedPhones.indexOf(product);
            selectedPhones[index].count--;
            $(`.productsTable tr`).eq(index + 1).children().eq(3).html(product.count);
            if(selectedPhones[index].count == 0)
            {                    
                $(e.target).closest(`tr`).remove();
                $(`.productsTable > tbody > tr`)
                    .slice(1, selectedPhones.length)
                    .each(function(i, val)
                    {
                        $(`td:first`, this).text(i + 1); 
                    });
                selectedPhones.splice(index, 1);
            }
            getTotalPrice();
            saveCart();
        });  
    }    

    getTotalPrice();
    saveCart();        
}

// Розрахунок загальної вартості всіх покупок
function getTotalPrice()
{
    let total = 0;
    selectedPhones.forEach( function(phone) {
        total += phone.count * parseInt(phone.priceUAH, 10);
    });
    $(`.productsTable td:last`).text(total + ` грн`);
}

// Зерегти кошик
function saveCart()
{
    window.localStorage.setItem("cart", JSON.stringify(selectedPhones));
}

// Завантажити кошик
function loadCart()
{
    let cartStr = window.localStorage.getItem("cart");
    if(cartStr == null || cartStr == "") return;
    let phones = JSON.parse(cartStr); 
    phones.forEach( function(element, index) {                
        addProductToCart(element);
    });
}