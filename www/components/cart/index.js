app.cart = kendo.observable({
    onShow: function () {
        $(".km-button").show();
        localStorage.setItem("screen", "cart");
        app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar").title("Cart");
        $("#check_auth").val(sessionStorage.getItem("sessionId"));

        app.mobileApp.showLoading();
        $.ajax({
            type: "GET",
            url: baseUrl + "cart/" + "?authentication=" + sessionStorage.getItem("sessionId"),
            contentType: "application/json",
            complete: function () {
                app.mobileApp.hideLoading();
                console.log("Request string: " + this.url + "?" + this.data);
            },
            success: function (data) {
                console.log(data);
                if (data.cartItems.length > 0) {
                    $("#cartIconBadge").show();
                    $(".cartNotEmpty").show();
                    $("#emptyCart").hide();
                    $("#cartIconBadge").val(data.cartItems.length);
                } else {
                    $("#emptyCart").show();
                    $("#cartIconBadge").hide();
                    $(".cartNotEmpty").hide();
                }

                let html = '';
                for (var [index, cartItem] of data.cartItems.entries()) {
                    html += `<div id="rowItem${cartItem.id}" class="row item-row"><div class="col s4">
                                <img style="width:100%" src="${baseUrl + cartItem.product.imageUrl}" alt="">
                            </div>
                            <div class="col s4">
                                <p>${cartItem.product.name}</p>
                                <p>${cartItem.product.price}/item</p>
                                <p id="priceProduct${cartItem.id}">${cartItem.product.price * cartItem.quantity}</p>
                                <select id="${"itemQuantity" + cartItem.id}" class="browser-default" onchange="updateQuantity(${cartItem.id},${cartItem.product.id})">
                                    <option value="" disabled selected>Select quantity</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                </select>
                            </div>
                            <div class="col s4">

                            <i style="color:red" class="material-icons large" onclick="removeCartItem(${cartItem.id})">delete</i>
      
                        </div>
                        
                        </div>
                        
                    `

                }

                document.getElementById("cart-items-row").innerHTML = html;

                $(".totalItems").text("TOTAL: ( " + data.cartItems.length + " )");
                $(".cartTotal").text(data.total);
                $("#OrderTotal").val(data.total);
        

                for (var [index, cartItem] of data.cartItems.entries()) {
                    $("#itemQuantity" + cartItem.id).val(cartItem.quantity);
                }

            },
            error: function (d, e, c) {
                console.log(d);
                console.log(e);
                console.log(c);
                if (d.hasOwnProperty('responseJSON')) {
                    if (d.responseJSON.error == "Authentication token not valid") {
                        navigator.notification.alert("No session found, please login", function () { }, e, "Ok");
                        window.app.mobileApp.navigate("components/login/view.html", "fade");
                    } else {
                        navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : c, function () { }, e, "Ok");
                    }

                } else {
                    navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : c, function () { }, e, "Ok");
                }
            }
        });

    },
    afterShow: function () { }
});

function updateQuantity(cartItemId, prodId) {
    console.log(cartItemId);
    app.mobileApp.showLoading();
    $.ajax({
        type: "PUT",
        url: baseUrl + "cart/update/" + "?authentication=" + sessionStorage.getItem("sessionId"),
        contentType: "application/json",
        data: JSON.stringify({ id: cartItemId, productId: prodId, quantity: $("#itemQuantity" + cartItemId).val() }),
        complete: function () {
            app.mobileApp.hideLoading();
            console.log("Request string: " + this.url + "?" + this.data);
        },
        success: function (data) {
            console.log(data);
            $.ajax({
                type: "GET",
                url: baseUrl + "cart/" + "?authentication=" + sessionStorage.getItem("sessionId"),
                contentType: "application/json",
                complete: function () {
                    app.mobileApp.hideLoading();
                    console.log("Request string: " + this.url + "?" + this.data);
                },
                success: function (data) {
                    console.log(data);
                    if (data.cartItems.length > 0) {
                        $("#cartIconBadge").show();
                        $("#cartIconBadge").val(data.cartItems.length);
                    } else {
                        $("#cartIconBadge").hide();
                    }
                    let theItem = data.cartItems.find(item => item.id === cartItemId);
                    $("#priceProduct" + cartItemId).text(theItem.product.price * theItem.quantity);
                    $(".cartTotal").text(data.total);
                    $("#OrderTotal").val(data.total);
                    M.toast({ html: 'Cart item updated!' });
                },
                error: function (d, e, c) {
                    console.log(d);
                    console.log(e);
                    console.log(c);

                    if (d.hasOwnProperty('responseJSON')) {
                        if (d.responseJSON.error == "Authentication token not valid") {
                            navigator.notification.alert("No session found, please login", function () { }, e, "Ok");
                            window.app.mobileApp.navigate("components/login/view.html", "fade");
                        } else {
                            navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : c, function () { }, e, "Ok");
                        }

                    } else {
                        navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : c, function () { }, e, "Ok");
                    }

                }
            });
        },
        error: function (d, e, c) {
            console.log(d);
            console.log(e);
            console.log(c);

            if (d.hasOwnProperty('responseJSON')) {
                if (d.responseJSON.error == "Authentication token not valid") {
                    navigator.notification.alert("No session found, please login", function () { }, e, "Ok");
                    window.app.mobileApp.navigate("components/login/view.html", "fade");
                } else {
                    navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : c, function () { }, e, "Ok");
                }

            } else {
                navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : c, function () { }, e, "Ok");
            }

        }
    });
}

function removeCartItem(cartItemId) {
    app.mobileApp.showLoading();
    $.ajax({
        type: "DELETE",
        url: baseUrl + "cart/delete/" + cartItemId + "?authentication=" + sessionStorage.getItem("sessionId"),
        contentType: "application/json",
        complete: function () {
            app.mobileApp.hideLoading();
            console.log("Request string: " + this.url + "?" + this.data);
        },
        success: function (data) {
            console.log(data);
            
            $.ajax({
                type: "GET",
                url: baseUrl + "cart/" + "?authentication=" + sessionStorage.getItem("sessionId"),
                contentType: "application/json",
                complete: function () {
                    app.mobileApp.hideLoading();
                    console.log("Request string: " + this.url + "?" + this.data);
                },
                success: function (data) {
                    console.log(data);
                    if (data.cartItems.length > 0) {
                        $("#cartIconBadge").show();
                        $(".cartNotEmpty").show();
                        $("#emptyCart").hide();
                        $("#cartIconBadge").val(data.cartItems.length);
                    } else {
                        $("#emptyCart").show();
                        $("#cartIconBadge").hide();
                        $(".cartNotEmpty").hide();
                    }
                    $(".cartTotal").text(data.total);
                    $("#OrderTotal").val(data.total);
                    $(".totalItems").text("TOTAL: ( " + data.cartItems.length + " )");
                    $("#rowItem" + cartItemId).remove();
                    M.toast({ html: 'Cart item removed!' });
                },
                error: function (d, e, c) {
                    console.log(d);
                    console.log(e);
                    console.log(c);

                    if (d.hasOwnProperty('responseJSON')) {
                        if (d.responseJSON.error == "Authentication token not valid") {
                            navigator.notification.alert("No session found, please login", function () { }, e, "Ok");
                            window.app.mobileApp.navigate("components/login/view.html", "fade");
                        } else {
                            navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : c, function () { }, e, "Ok");
                        }

                    } else {
                        navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : c, function () { }, e, "Ok");
                    }

                }
            });
        },
        error: function (d, e, c) {
            console.log(d);
            console.log(e);
            console.log(c);

            if (d.hasOwnProperty('responseJSON')) {
                if (d.responseJSON.error == "Authentication token not valid") {
                    navigator.notification.alert("No session found, please login", function () { }, e, "Ok");
                    window.app.mobileApp.navigate("components/login/view.html", "fade");
                } else {
                    navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : c, function () { }, e, "Ok");
                }

            } else {
                navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : c, function () { }, e, "Ok");
            }

        }
    });
}



(function (parent) {
    var cartModel = kendo.observable({
        back: function () {
            window.app.mobileApp.navigate("components/carts/view.html", "fade");
        },
        shop: function (){
            window.app.mobileApp.navigate("components/categories/view.html", "fade");
        },
        goToCheckout : function (){
            sessionStorage.setItem("checkoutStatus", "true");
            window.app.mobileApp.navigate("components/addressBook/view.html", "fade");
        }
    });
    parent.set('cartModel', cartModel);
})(app.cart);
