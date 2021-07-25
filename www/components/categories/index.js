app.categories = kendo.observable({
    onShow: function () {
        $(".km-button").hide();
        localStorage.setItem("screen", "categories");
        app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar").title("Categories");
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
                let count = 0;
                let html = '';
                let firstRow = document.createElement("div");

                for (var [index, category] of data.entries()) {
                    html += `<div class="col s4 individal-category" id="${category.categoryName}"><div class="category-container"><div class="category-image"> <img src="${baseUrl + category.imageUrl }" alt=""></div></div><br><center>${category.categoryName}</center></div>`;
                    // if(count == 0){
                    //     html += `<div class="row"><div class="col s4 individal-category"><div class="category-container"></div></div><br><center>${category.categoryName}</center></div>`;
                    // }

                    // if(count % 3 !== 0 && count > 0){
                    //     html += `<div class="col s4 individal-category"><div class="category-container"></div><br><center>${category.categoryName}</center></div>`;
                    // }

                    // if(count % 3 == 0 && count > 0){
                    //     console.log(count);
                    //     html += '</div><div class="row">';
                    //     html += `<div class="col s4 individal-category"><div class="category-container"></div><br><center>${category.categoryName}</center></div>`;
                    // }

                    // count ++;
                }

                document.getElementById("categories-inner-container").innerHTML = html;
                $(".category-container").css("height", 0.15 * window.innerHeight + 'px');
                $('.individal-category').click(function (e) {
                    console.log(e.currentTarget.id);
                    sessionStorage.setItem("productCategory", e.currentTarget.id);
                    window.app.mobileApp.navigate("components/products/view.html", "fade");
                });

                $("#categories-inner-container").css("font-size", 0.0132 * window.innerHeight)
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
        if (sessionStorage.getItem("sessionId") !== null && sessionStorage.getItem("sessionId") !== undefined) {
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

    }
});

(function (parent) {
    var categoriesModel = kendo.observable({
        viewProducts: function (category) {
            alert("View products from category" + category)
        }
    });
    parent.set('categoriesModel', categoriesModel);
})(app.categories);