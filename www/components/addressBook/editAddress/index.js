app.editAddress = kendo.observable({
    onShow: function () {
        $(".km-button").show();
        localStorage.setItem("screen", "editAddress");
        app.editAddress.editAddressModel.fields.set("receipientName", "");
        app.editAddress.editAddressModel.fields.set("receipientNumber", "");
        app.editAddress.editAddressModel.fields.set("streetAddress", "");
        app.editAddress.editAddressModel.fields.set("suburb", "");
        app.editAddress.editAddressModel.fields.set("city", "");
        app.editAddress.editAddressModel.fields.set("province", "");
        app.editAddress.editAddressModel.fields.set("postalCode", "");

        let headerText = "Add Delivery Address";
        app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar").title(headerText);
        if (sessionStorage.getItem("editAddressMode") == "edit") {
            let addressId = sessionStorage.getItem("addressToEdit");
            app.mobileApp.showLoading();
            $.ajax({
                type: "GET",
                url: baseUrl + "address/get/" + addressId + "?authentication=" + sessionStorage.getItem("sessionId"),
                contentType: "application/json",
                complete: function () {
                    app.mobileApp.hideLoading();
                    console.log("Request string: " + this.url + "?" + this.data);
                },
                success: function (data) {
                    console.log(data);
                    sessionStorage.setItem("addressObject", JSON.stringify(data));
                    app.editAddress.editAddressModel.fields.set("receipientName", data.receipientName);
                    app.editAddress.editAddressModel.fields.set("receipientNumber", data.receipientNumber);
                    app.editAddress.editAddressModel.fields.set("streetAddress", data.streetAddress);
                    app.editAddress.editAddressModel.fields.set("suburb", data.suburb);
                    app.editAddress.editAddressModel.fields.set("city", data.city);
                    app.editAddress.editAddressModel.fields.set("province", data.province);
                    app.editAddress.editAddressModel.fields.set("postalCode", data.postalCode);
                    headerText = "Edit Delivery Address";
                    app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar").title(headerText);
                    M.updateTextFields();
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


    },
    afterShow: function () {

    }
});

(function (parent) {
    var editAddressModel = kendo.observable({
        fields: {
            'receipientName': '',
            'receipientNumber': '',
            'streetAddress': '',
            'suburb': '',
            'city': '',
            'province': '',
            'postalCode': ''
        },
        saveAddress: function () {
            let addressDto = {
                "receipientName": editAddressModel.fields.receipientName,
                "receipientNumber": editAddressModel.fields.receipientNumber,
                "streetAddress": editAddressModel.fields.streetAddress,
                "suburb": editAddressModel.fields.suburb,
                "city": editAddressModel.fields.city,
                "province": editAddressModel.fields.province,
                "postalCode": editAddressModel.fields.postalCode,
            }
            let RequestParams = {
                type: "POST",
                url: baseUrl + "address/add/" + "?authentication=" + sessionStorage.getItem("sessionId"),
                contentType: "application/json",
                data: JSON.stringify(addressDto)
            }

            if (sessionStorage.getItem("editAddressMode") === "edit") {
                RequestParams["type"] = "PUT";
                RequestParams["url"] = baseUrl + "address/update/" + JSON.parse(sessionStorage.getItem("addressObject")).id + "?authentication=" + sessionStorage.getItem("sessionId");
                RequestParams["data"] = JSON.stringify(addressDto)
            }

            app.mobileApp.showLoading();
            $.ajax($.extend(RequestParams, {
                complete: function () {
                    app.mobileApp.hideLoading();
                    console.log("Request string: " + this.url + "?" + this.data);


                },
                success: function (data) {
                    console.log(data);
                    window.app.mobileApp.navigate("components/addressBook/view.html", "fade");
                    navigator.notification.alert(data.message, function () { }, sessionStorage.getItem("editAddressMode") === "edit" ?
                        "Edit Address" : "Add Address", "Ok");
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
            }));
        }
    });
    parent.set('editAddressModel', editAddressModel);
})(app.editAddress);