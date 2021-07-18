app.product = kendo.observable({
    onShow: function () {
        $(".km-button").show();
        localStorage.setItem("screen", "product");
        app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar").title("");

        app.mobileApp.showLoading();
        $.ajax({
            type: "GET",
            url: baseUrl + "product/getProduct/" + sessionStorage.getItem("focusProduct"),
            contentType: "application/json",
            complete: function () {
                app.mobileApp.hideLoading();
                console.log("Request string: " + this.url + "?" + this.data);
            },
            success: function (data) {
                console.log(data);
                document.getElementById("view-product").src = baseUrl + data.imageUrl;
                $("#view-product-name").text(data.name);
                $("#view-product-price").text(data.price);
                $("#product-description").text(data.description);

                app.product.productModel.fields.set("productId", data.id);
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
                        window.app.mobileApp.navigate("components/home/view.html", "fade");
                    }

                } else {
                    navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : c, function () { }, e, "Ok");
                    window.app.mobileApp.navigate("components/home/view.html", "fade");
                }
            }
        });

    },
    afterShow: function () { 

    }
});

(function (parent) {
    var productModel = kendo.observable({
        fields: {
            productId: ''
        },
        back: function () {
            window.app.mobileApp.navigate("components/products/view.html", "fade");
        },
        addToCart: function () {
            if (productModel.fields.productId !== '') {
                app.mobileApp.showLoading();
                $.ajax({
                    type: "POST",
                    url: baseUrl + "cart/add/" + "?authentication=" + sessionStorage.getItem("sessionId"),
                    contentType: "application/json",
                    data: JSON.stringify({ productId: productModel.fields.productId, quantity: 1 }),
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
                                M.toast({ html: 'Item added to shopping cart!' });
                                window.app.mobileApp.navigate("components/categories/view.html", "fade");
                                console.log(data);
                                if (data.cartItems.length > 0) {
                                    $("#cartIconBadge").val(data.cartItems.length);
                                } else {
                                    $("#cartIconBadge").hide();
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
            } else {
                alert("Oops, something isn't right");
            }

        }
    });
    parent.set('productModel', productModel);
})(app.product);
