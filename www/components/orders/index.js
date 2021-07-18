app.orders = kendo.observable({
    onShow: function () {
        $(".km-button").show();
        localStorage.setItem("screen", "orders");
        sessionStorage.removeItem("sessionOrder");
        app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar").title("Orders");
        var instance = M.Tabs.init($('.tabs'), {onShow: function(){
            let statusTab = $('.tabs').find('.active').attr("href").split("#")[1];
            app.mobileApp.showLoading();
            $.ajax({
                type: "GET",
                url: baseUrl + "order/orders" + "?authentication=" + sessionStorage.getItem("sessionId"),
                contentType: "application/json",
                complete: function () {
                    app.mobileApp.hideLoading();
                    console.log("Request string: " + this.url + "?" + this.data);
                },
                success: function (data) {
                    console.log(data);
                    let html = '';
                    for (var [index, order] of data.entries()) {
                        var status = "";
                        if(order.status === "pending"){
                            status = "Pending";
                        }else if(order.status === "confirm"){
                            status = "Confirmed";
                        }
                        else if(order.status === "processing"){
                            status = "Processing";
                        }
                        else{
                            status = "Delivered";
                        }
                       
                        if(statusTab === "allOrders"){
                            html += `<div id="rowOrder${order.id}" class="row item-row individual-order "><div class="col s4">
                                        <img style="width:100%" src="${baseUrl + order.orderItems[0].product.imageUrl}" alt="">
                                     </div>
                        <div class="col s8">
                            <p>${order.id}</p>
                            <p>${order.totalPrice}</p>
                            <p>${order.createdDate.split(":")[0]}</p>
                            <a class="btn disabled">${status}</a>
                            </div>
                         </div>
                            `
                            document.getElementById("allOrders-items-row").innerHTML = html;
                        }else if(statusTab === "pendingOrders"){
                            if(order.status === "pending"){
                                html += `<div id="rowOrder${order.id}" class="row item-row individual-order"><div class="col s4">
                                        <img style="width:100%" src="${baseUrl + order.orderItems[0].product.imageUrl}" alt="">
                                     </div>
                                    <div class="col s8">
                                        <p>${order.id}</p>
                                        <p>${order.totalPrice}</p>
                                        <p>${order.createdDate.split(":")[0]}</p>
                                        <a class="btn disabled">${status}</a>
                                        </div>
                                    </div>
                                `
                            }
                            document.getElementById("pendingOrders-items-row").innerHTML = html;

                        }else if(statusTab === "confirmedOrders"){
                            if(order.status === "confirm"){
                                html += `<div id="rowOrder${order.id}" class="row item-row individual-order"><div class="col s4">
                                        <img style="width:100%" src="${baseUrl + order.orderItems[0].product.imageUrl}" alt="">
                                     </div>
                                    <div class="col s8">
                                        <p>${order.id}</p>
                                        <p>${order.totalPrice}</p>
                                        <p>${order.createdDate.split(":")[0]}</p>
                                        <a class="btn disabled">${status}</a>
                                        </div>
                                    </div>
                                `
                            }
                            document.getElementById("confirmedOrders-items-row").innerHTML = html;
                        }
                        else if(statusTab === "processOrders"){
                            if(order.status == "processing"){
                                html += `<div id="rowOrder${order.id}" class="row item-row individual-order"><div class="col s4">
                                        <img style="width:100%" src="${baseUrl + order.orderItems[0].product.imageUrl}" alt="">
                                     </div>
                                    <div class="col s8">
                                        <p>${order.id}</p>
                                        <p>${order.totalPrice}</p>
                                        <p>${order.createdDate.split(":")[0]}</p>
                                        <a class="btn disabled">${status}</a>
                                        </div>
                                    </div>
                                `
                            }
                            document.getElementById("processOrders-items-row").innerHTML = html;
                        }else if(statusTab === "deliveredOrders"){
                            if(order.status === "delivered"){
                                html += `<div id="rowOrder${order.id}" class="row item-row individual-order"><div class="col s4">
                                        <img style="width:100%" src="${baseUrl + order.orderItems[0].product.imageUrl}" alt="">
                                     </div>
                                    <div class="col s8">
                                        <p>${order.id}</p>
                                        <p>${order.totalPrice}</p>
                                        <p>${order.createdDate.split(":")[0]}</p>
                                        <a class="btn disabled">${status}</a>
                                        </div>
                                    </div>
                                `
                            }
                            document.getElementById("deliveredOrders-items-row").innerHTML = html;
                        }
                    }

                    $('.individual-order').click(function (e) {
                        let theOrder = data.find(order => "rowOrder" + order.id === e.currentTarget.id);
                        if(theOrder.payment !== "paid"){
                            navigator.notification.alert("Payment for this order fined ", function () { }, "Paypal Error", "Ok");
                            //console.log(theOrder)
                            // sessionStorage.setItem("orderInprogress", theOrder.id);
                            // PayPalMobile.renderSinglePaymentUI(app.payment.createPayment(theOrder), app.payment.onSuccesfulPayment, app.payment.onUserCanceled);
                        }else{
                            sessionStorage.setItem("sessionOrder", JSON.stringify(theOrder))
                            window.app.mobileApp.navigate("components/orderDetails/view.html", "fade");
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

        }});
       

    },
    afterShow: function () {
        var instance = M.Tabs.getInstance($('.tabs'));
        instance.select('allOrders');
     }
});

(function (parent) {
    var ordersModel = kendo.observable({
        back: function () {
            //window.app.mobileApp.navigate("components/orders/view.html", "fade");
        },
       
    });
    parent.set('ordersModel', ordersModel);
})(app.orders);
