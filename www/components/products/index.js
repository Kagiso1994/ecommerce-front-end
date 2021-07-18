app.products = kendo.observable({
    onShow: function () {
        $(".km-button").show();
        localStorage.setItem("screen", "products");
        app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar").title(sessionStorage.getItem("productCategory"));
        app.mobileApp.showLoading();
        $.ajax({
            type: "GET",
            url: baseUrl + "category/",
            contentType: "application/json",
            complete: function () {
                app.mobileApp.hideLoading();
                console.log("Request string: " + this.url + "?" + this.data);
            },
            success: function (data) {
                console.log(data);
                let html = '';
                let firstRow = document.createElement("div");

                let categoryProducts = data.find(category => category.categoryName === sessionStorage.getItem("productCategory"));
                console.log(categoryProducts);
                for (var [index, product] of categoryProducts.products.entries()) {
                    html += `<div class="col s6 individal-product ${index === 0 || index % 2 === 0 ? 'individal-product-right-border' : ''}">
                    <div class="product-container">
                    <div class="product-image" id="${product.id}"> 
                        <img src="${baseUrl + product.imageUrl}" alt="">
                    </div>
                    <div class="row prod-desc-row">
                        <div class="col s12">
                            <h5>${product.name}</h5>
                            <br>
                            <h5>${product.price}</h5>
                        </div>
                    </div>
                    </div></div>`;
                }

                document.getElementById("products-inner-container").innerHTML = html;
                $(".product-container").css("height", 0.30 * window.innerHeight + 'px');

                $('.product-image').click(function (e) {
                    console.log(e.currentTarget.id);
                    sessionStorage.setItem("focusProduct", e.currentTarget.id);
                    window.app.mobileApp.navigate("components/product/view.html", "fade");
                });
            },
            error: function (d, e, c) {
                console.log(d);
                console.log(e);
                console.log(c);
                navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : c, function () { }, e, "Ok")
            }
        });
    },
    afterShow: function () { 

    }
});

// function addToCart(productId) {
//     console.log(productId);
//     app.mobileApp.showLoading();
//     $.ajax({
//         type: "POST",
//         url: baseUrl + "cart/add/" + "?authentication=" + sessionStorage.getItem("sessionId"),
//         contentType: "application/json",
//         data: JSON.stringify({ productId: productId, quantity: 1 }),
//         complete: function () {
//             app.mobileApp.hideLoading();
//             console.log("Request string: " + this.url + "?" + this.data);
//         },
//         success: function (data) {
//             console.log(data);
//             document.getElementById('qtyItem' + productId).stepUp();
//         },
//         error: function (d, e, c) {
//             console.log(d);
//             console.log(e);
//             console.log(c);

//             if (d.hasOwnProperty('responseJSON')) {
//                 if (d.responseJSON.error == "Authentication token not valid") {
//                     navigator.notification.alert("No session found, please login", function () { }, e, "Ok");
//                     window.app.mobileApp.navigate("components/login/view.html", "fade");
//                 } else {
//                     navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : c, function () { }, e, "Ok");
//                 }

//             } else {
//                 navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : c, function () { }, e, "Ok");
//             }

//         }
//     });

// }

// function deleteFromCart(productId) {
//     console.log(productId);
    

//     app.mobileApp.showLoading();
//     $.ajax({
//         type: "GET",
//         url: baseUrl + "cart/" + "?authentication=" + sessionStorage.getItem("sessionId"),
//         contentType: "application/json",
//         complete: function () {
//             app.mobileApp.hideLoading();
//             console.log("Request string: " + this.url + "?" + this.data);
//         },
//         success: function (data) {
//             console.log(data);

//             let cartItem = data.cartItems.find(item => item.product.id === productId);

//             if (cartItem !== undefined) {
//                 app.mobileApp.showLoading();
//                 $.ajax({
//                     type: "DELETE",
//                     url: baseUrl + "cart/delete/" + cartItem.id + "?authentication=" + sessionStorage.getItem("sessionId"),
//                     contentType: "application/json",
//                     data: JSON.stringify({ productId: productId, quantity: 1 }),
//                     complete: function () {
//                         app.mobileApp.hideLoading();
//                         console.log("Request string: " + this.url + "?" + this.data);
//                     },
//                     success: function (data) {
//                         console.log(data);
//                         document.getElementById('qtyItem' + productId).stepDown();
//                     },
//                     error: function (d, e, c) {
//                         console.log(d);
//                         console.log(e);
//                         console.log(c);

//                         if (d.hasOwnProperty('responseJSON')) {
//                             if (d.responseJSON.error == "Authentication token not valid") {
//                                 navigator.notification.alert("No session found, please login", function () { }, e, "Ok");
//                                 window.app.mobileApp.navigate("components/login/view.html", "fade");
//                             } else {
//                                 navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : c, function () { }, e, "Ok");
//                             }

//                         } else {
//                             navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : c, function () { }, e, "Ok");
//                         }

//                     }
//                 });

//             }
//         },
//         error: function (d, e, c) {
//             console.log(d);
//             console.log(e);
//             console.log(c);
//             if (d.hasOwnProperty('responseJSON')) {
//                 if (d.responseJSON.error == "Authentication token not valid") {
//                     navigator.notification.alert("No session found, please login", function () { }, e, "Ok");
//                     window.app.mobileApp.navigate("components/login/view.html", "fade");
//                 } else {
//                     navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : c, function () { }, e, "Ok");
//                 }

//             } else {
//                 navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : c, function () { }, e, "Ok");
//             }
//         }
//     });

// }

(function (parent) {
    var productsModel = kendo.observable({
    });
    parent.set('productsModel', productsModel);
})(app.products);


{/* <div style="margin:0px" class="row">
<div class="col s12 row-buttons">
    <div class="row ${index === 0 || index % 2 === 0 ? 'pad-item' : ''}">
        <button class="float-items-right incrCart btn btn-small" onclick="addToCart(${product.id})">+</button>
    </div>
    <div class="row ${index === 0 || index % 2 === 0 ? 'pad-item' : ''}">
        <input class="float-items-right cartQuantity" id="qtyItem${product.id}" type="number" min="0" max="50" disabled>
    </div>
    <div class="row ${index === 0 || index % 2 === 0 ? 'pad-item' : ''}">
        <button class="float-items-right decrCart btn btn-small" onclick="deleteFromCart(${product.id})">-</button>
    </div>
</div>
</div> */}
