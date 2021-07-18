app.addressBook = kendo.observable({
    onShow: function () {
        $(".km-button").show();
        localStorage.setItem("screen", "addressBook");
        app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar").title("Delivery Addresses");
        sessionStorage.removeItem("addressToEdit");
        sessionStorage.removeItem("editAddressMode");
        populateAddressBook();


    },
    afterShow: function () {

    }
});

function populateAddressBook() {
    app.mobileApp.showLoading();
    $.ajax({
        type: "GET",
        url: baseUrl + "address/get/all" + "?authentication=" + sessionStorage.getItem("sessionId"),
        contentType: "application/json",
        complete: function () {
            app.mobileApp.hideLoading();
            console.log("Request string: " + this.url + "?" + this.data);
        },
        success: function (data) {
            console.log(data);
            let html = "";
            for (var [index, address] of data.entries()) {
                html += `
                <div style="background-color: white;padding-bottom: 15px;">
                        <li style="padding-bottom: 0px;font-size: 15px;" id="li-${address.id}" class="userDetails-li" onclick="editAddress(this)">
                        <div class="row addressBookRow">
                            <div class="col s10">
                                <span class="labelUserDetails">
                                    ${address.receipientName}
                                </span>
                                <br>
                                <span>
                                ${address.streetAddress}, ${address.suburb}, ${address.city}, ${address.province}, ${address.postalCode}
                                </span>
                                <br>
                                <div style="margin-top: 8px;color: lightgray;">
                                <span >
                                ${address.receipientNumber}
                                </span>
                                </div>
                                <br>
                            </div>
                            <div class="col s2">
                                <span class="editaddressBook">
                                    <i style="float:right" class="small material-icons">arrow_forward</i>
                                </span>
                            </div>
                        </div>
                    </li>
                    <br>
                    <a class="editUserDetails" id="del-${address.id}" style="float: none;margin: 0 0.75rem;" onclick="editAddress(this)">EDIT</a> 
                    <a class="editUserDetails" style="float: none;margin: 0 0.75rem;" id="delete-${address.id}" onclick="deleteAddress(this)">DELETE</a>
                    </div>
                    <hr style="margin: 0px;border-color: #eadede;">
                `
            }

            document.getElementById("addressesList").innerHTML = html;
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


function editAddress(e) {
    console.log(e.id);
    sessionStorage.setItem("editAddressMode", "edit");
    sessionStorage.setItem("addressToEdit", e.id.split("-")[1]);
    if (sessionStorage.getItem("checkoutStatus") === "true" && e.id.split("-")[0] === "li") {
        checkout(e.id.split("-")[1]);
        
    } else {
        window.app.mobileApp.navigate("components/addressBook/editAddress/view.html", "fade");
    }
}

function deleteAddress(e) {
    console.log(e.id);
    navigator.notification.confirm(
        'Are you sure you want to delete this address?',
        onConfirm,
        'Delete Address',
        ['Delete', 'Cancel']
    );
    function onConfirm(buttonIndex) {
        if (buttonIndex == 1) {
            app.mobileApp.showLoading();
            $.ajax({
                type: "DELETE",
                url: baseUrl + "address/delete/" + e.id.split("-")[1] + "?authentication=" + sessionStorage.getItem("sessionId"),
                contentType: "application/json",
                complete: function () {
                    app.mobileApp.hideLoading();
                    console.log("Request string: " + this.url + "?" + this.data);
                },
                success: function (data) {
                    console.log(data);
                    populateAddressBook();
                    navigator.notification.alert("Address successfully deleted", function () { }, e, "Ok");

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

}

(function (parent) {
    var addressBookModel = kendo.observable({
        fields: {

        },
        addAddress: function (e) {
            sessionStorage.setItem("editAddressMode", "add");
            window.app.mobileApp.navigate("components/addressBook/editAddress/view.html", "fade");
        }
    });
    parent.set('addressBookModel', addressBookModel);
})(app.addressBook);