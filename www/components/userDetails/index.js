app.userDetails = kendo.observable({
    onShow: function () {
        $(".km-button").show();
        localStorage.setItem("screen", "userDetails");
        app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar").title("Personal Details");
        app.mobileApp.showLoading();
        $.ajax({
            type: "GET",
            url: baseUrl + "user/userProfile" + "?authentication=" + sessionStorage.getItem("sessionId"),
            contentType: "application/json",
            complete: function () {
                app.mobileApp.hideLoading();
                console.log("Request string: " + this.url + "?" + this.data);
            },
            success: function (data) {
                console.log(data);
                app.userDetails.userDetailsModel.fields.set("name", data.firstName + " " + data.lastName);
                app.userDetails.userDetailsModel.fields.set("email", data.email);
                if(data.mobileNumber == null){
                    $("#addMobileNum").show();
                    $("#editMobileNum").hide();
                }else{
                    $("#addMobileNum").hide();
                    $("#editMobileNum").show();
                    app.userDetails.userDetailsModel.fields.set("mobilNo", data.mobileNumber);
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
    afterShow: function () {

    }
});

(function (parent) {
    var userDetailsModel = kendo.observable({
        fields: {
            'name': '',
            'email': '',
            'mobilNo': '',
            'password': '********',
            
        },
        editNames: function () {
            sessionStorage.setItem("editMode", "editNames");
            window.app.mobileApp.navigate("components/userDetails/editDetails/view.html", "fade");
        },
        editEmail: function () {
            sessionStorage.setItem("editMode", "editEmail");
            window.app.mobileApp.navigate("components/userDetails/editDetails/view.html", "fade");
        },
        editMobileNum: function () {
            sessionStorage.setItem("editMode", "editMobileNum");
            window.app.mobileApp.navigate("components/userDetails/editDetails/view.html", "fade");
        },
        editPassword: function () {
            sessionStorage.setItem("editMode", "editPassword");
            window.app.mobileApp.navigate("components/userDetails/editDetails/view.html", "fade");
        }
    });
    parent.set('userDetailsModel', userDetailsModel);
})(app.userDetails);