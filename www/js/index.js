/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


//const baseUrl = "https://groceries-ecommerce.herokuapp.com/";
const baseUrl = "http://192.168.8.100:8080/";

(function () {
    var app = {
        data: {}
    };
    var bootstrap = function () {
        $(function () {
            app.mobileApp = new kendo.mobile.Application(document.body, {
                transition: 'fade',
                skin: 'flat',
                initial: 'components/login/view.html',
            });

        });
    };


    if (window.cordova) {
        document.addEventListener('deviceready', function () {
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }
            app.payment.initPaymentUI();
            function setTextZoomCallback(textZoom) {
                console.log('WebView text should be scaled ' + textZoom + '%')
            }
            if (window.MobileAccessibility) {
                window.MobileAccessibility.usePreferredTextZoom(false);
                MobileAccessibility.setTextZoom(80, setTextZoomCallback);
            }

            // Back Button Handling
            document.addEventListener('backbutton', function (evt) {
                if (localStorage.getItem("screen") == "categories") {
                    function onConfirm(button) {
                        if (button == 2) {//If User selected No, then we just do nothing
                            return;
                        } else {
                            navigator.app.exitApp();// Otherwise we quit the app.
                        }
                    }
                    navigator.notification.confirm("Are you sure you want to exit ?", onConfirm, "Confirmation", "Yes,No");
                } else {
                    navigateBack();
                }

            }, false);

            bootstrap();
        }, false);
    } else {
        bootstrap();
    }

    app.payment = {
        initPaymentUI: function () {
            var clientIDs = {
                "PayPalEnvironmentProduction": "YOUR_PRODUCTION_CLIENT_ID",
                "PayPalEnvironmentSandbox": "AXXbDHrHGDoPi6ZSimd1eVMnQoUx0bkoMd8mLcLAC5BA_XpmSGX2OI02gV2FiVi7Wofu_MPV0P3RNAOy"
            };
            PayPalMobile.init(clientIDs, app.payment.onPayPalMobileInit);

        },
        onSuccesfulPayment: function (payment) {
            console.log("payment success: " + JSON.stringify(payment, null, 4));

            $.ajax({
                type: "PUT",
                url: baseUrl + "order/update/" + sessionStorage.getItem("orderInprogress") + "?authentication=" + sessionStorage.getItem("sessionId"),
                contentType: "application/json",
                data: JSON.stringify({ "payment": "paid" }),
                complete: function () {
                    app.mobileApp.hideLoading();
                    console.log("Request string: " + this.url + "?" + this.data);
                },
                success: function (data) {
                    console.log(data);
                    //M.toast({ html: 'Payment for order number' +  orderNo + ' successfully received!'});
                    navigator.notification.alert('Payment for order number' + sessionStorage.getItem("orderInprogress") + ' successfully received!', function () { }, 'Payment sucess', "Ok");
                    sessionStorage.removeItem("orderInprogress");
                    sessionStorage.removeItem("checkoutStatus");
                    window.app.mobileApp.navigate("components/categories/view.html", "fade");

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
        onAuthorizationCallback: function (authorization) {
            console.log("authorization: " + JSON.stringify(authorization, null, 4));
        },
        createPayment: function (payObj) {
            // for simplicity use predefined amount
            var paymentDetails = new PayPalPaymentDetails(payObj.totalCost, "0.00", "0.00");
            var payment = new PayPalPayment(payObj.totalCost, "USD", payObj.id, "Sale",
                paymentDetails);
            return payment;
        },
        configuration: function () {
            // for more options see `paypal-mobile-js-helper.js`
            var config = new PayPalConfiguration({
                merchantName: "My test shop",
                merchantPrivacyPolicyURL: "https://mytestshop.com/policy",
                merchantUserAgreementURL: "https://mytestshop.com/agreement"
            });
            return config;
        },
        onPrepareRender: function () {
            // buttons defined in index.html
            //  <button id="buyNowBtn"> Buy Now !</button>
            //  <button id="buyInFutureBtn"> Pay in Future !</button>
            //  <button id="profileSharingBtn"> ProfileSharing !</button>
            var buyNowBtn = document.getElementById("buyNowBtn");
            var buyInFutureBtn = document.getElementById("buyInFutureBtn");
            var profileSharingBtn = document.getElementById("profileSharingBtn");
        },
        onPayPalMobileInit: function () {
            // must be called
            // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
            PayPalMobile.prepareToRender("PayPalEnvironmentNoNetwork", app.payment.configuration(),
                app.payment.onPrepareRender);
        },
        onUserCanceled: function (result) {
            console.log(result);
            $.ajax({
                type: "DELETE",
                url: baseUrl + "order/delete/" + sessionStorage.getItem("orderInprogress") + "?authentication=" + sessionStorage.getItem("sessionId"),
                contentType: "application/json",
                complete: function () {
                    app.mobileApp.hideLoading();
                    console.log("Request string: " + this.url + "?" + this.data);
                },
                success: function (data) {
                    console.log(data);
                    sessionStorage.removeItem("orderInprogress");
                    sessionStorage.removeItem("checkoutStatus");
                    window.app.mobileApp.navigate("components/categories/view.html", "fade");

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


    window.app = app;
}());

function navCategories() {
    window.app.mobileApp.navigate("components/categories/view.html", "fade");
}

function navOrders() {
    if (sessionStorage.getItem("sessionId") !== null && sessionStorage.getItem("sessionId") !== undefined) {
        window.app.mobileApp.navigate("components/orders/view.html", "fade");
    } else {
        window.app.mobileApp.navigate("components/login/view.html", "fade");
    }
}

function navCart() {
    if (sessionStorage.getItem("sessionId") !== null && sessionStorage.getItem("sessionId") !== undefined) {
        window.app.mobileApp.navigate("components/cart/view.html", "fade");
    } else {
        window.app.mobileApp.navigate("components/login/view.html", "fade");
    }
}

function navAccount() {
    if (sessionStorage.getItem("sessionId") !== null && sessionStorage.getItem("sessionId") !== undefined) {
        window.app.mobileApp.navigate("components/account/view.html", "fade");
    } else {
        window.app.mobileApp.navigate("components/login/view.html", "fade");
    }
}


function navigateBack() {
    var currentScreen = localStorage.getItem("screen");
    if (currentScreen == "home") {
        if (device.platform.toLowerCase() == "android") {
            navigator.notification.confirm("Are you sure you want to exit?", function (buttonIndex) {
                if (buttonIndex == "1") {
                    navigator.app.exitApp();
                }
            }, "Confirmation", "Yes,No");
        } else {
            //iOS code
        }
    } else {
        navigator.app.backHistory();
    }
}

checkout = function check(deliveryAddressId) {
    app.mobileApp.showLoading();
    $.ajax({
        type: "POST",
        url: baseUrl + "order/add/" + deliveryAddressId + "?authentication=" + sessionStorage.getItem("sessionId"),
        contentType: "application/json",
        complete: function () {
            app.mobileApp.hideLoading();
            console.log("Request string: " + this.url + "?" + this.data);
        },
        success: function (data) {
            console.log(data);
            sessionStorage.setItem("orderInprogress", data.id);
            PayPalMobile.renderSinglePaymentUI(app.payment.createPayment(data), app.payment.onSuccesfulPayment, app.payment.onUserCanceled);
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
