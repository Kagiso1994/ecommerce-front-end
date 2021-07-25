app.account = kendo.observable({
    onShow: function () {
        $(".km-button").show();
        localStorage.setItem("screen", "account");
        $.ajax({
            type: "GET",
            url: baseUrl + "user/customer" + "?authentication=" + sessionStorage.getItem("sessionId"),
            contentType: "application/json",
            complete: function () {
                app.mobileApp.hideLoading();
                console.log("Request string: " + this.url + "?" + this.data);
            },
            success: function (data) {
                console.log(data);
                app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar").title(data.firstName + " " + data.lastName);
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
    afterShow: function () {

    }
});

(function (parent) {
    var accountModel = kendo.observable({
        orders: function () {
            navOrders();
        },
        userDetails: function () {
            window.app.mobileApp.navigate("components/userDetails/view.html", "fade");
        },
        addressBook: function (){
            sessionStorage.setItem("checkoutStatus","false");
            window.app.mobileApp.navigate("components/addressBook/view.html", "fade");
        },
        logout : function () {
            window.app.mobileApp.navigate("components/login/view.html", "fade");
            sessionStorage.removeItem("sessionId");
        }
    });
    parent.set('accountModel', accountModel);
})(app.account);