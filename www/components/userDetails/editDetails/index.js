app.editDetails = kendo.observable({
    onShow: function () {
        $(".km-button").show();
        localStorage.setItem("screen", "editDetails");
        let headerText = "";
        if (sessionStorage.getItem("editMode") == "editNames") {
            $(".formEditNames").show();
            $(".formEditEmail").hide();
            $(".formEditMobileNum").hide();
            $(".formEditPassword").hide();
            headerText = "Edit Your Name";
        } else if (sessionStorage.getItem("editMode") == "editEmail") {
            headerText = "Edit Email Address";
            $(".formEditEmail").show();
            $(".formEditMobileNum").hide();
            $(".formEditPassword").hide();
            $(".formEditNames").hide();

        } else if (sessionStorage.getItem("editMode") == "editMobileNum") {
            headerText = "Edit Mobile Number";
            $(".formEditMobileNum").show();
            $(".formEditPassword").hide();
            $(".formEditNames").hide();
            $(".formEditEmail").hide();
        } else if (sessionStorage.getItem("editMode") == "editPassword") {
            headerText = "Reset Password";
            $(".formEditPassword").show();
            $(".formEditMobileNum").hide();
            $(".formEditNames").hide();
            $(".formEditEmail").hide();
        }
        app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar").title(headerText);

        app.mobileApp.showLoading();
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
                app.editDetails.editDetailsModel.fields.set("firstname", data.firstName);
                app.editDetails.editDetailsModel.fields.set("lastname", data.lastName);
                app.editDetails.editDetailsModel.fields.set("email", data.commEmail);
                if (data.mobileNumber == null && sessionStorage.getItem("editMode") == "editMobileNum") {
                    app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar").title("Add Mobile Number");
                } else {
                    app.editDetails.editDetailsModel.fields.set("mobilNo", data.mobileNumber);
                }
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

    },
    afterShow: function () {

    }
});

(function (parent) {
    var editDetailsModel = kendo.observable({
        fields: {
            'firstname': '',
            'lastname': '',
            'email': '',
            'mobileNum': '',
            'oldPassword': '',
            'newPassword': '',
            'confirmPassword': ''
        },
        saveNames: function () {
            app.mobileApp.showLoading();
            $.ajax({
                type: "GET",
                url: baseUrl + "user/customer" + "?authentication=" + sessionStorage.getItem("sessionId"),
                contentType: "application/json",
                complete: function () {
                    console.log("Request string: " + this.url + "?" + this.data);
                },
                success: function (data) {
                    console.log(data);
                    let userProfile = data;
                    userProfile["firstName"] = app.editDetails.editDetailsModel.fields.firstname;
                    userProfile["lastName"] = app.editDetails.editDetailsModel.fields.lastname;
                    $.ajax({
                        type: "PUT",
                        url: baseUrl + "user/updateUserProfile/" + "?authentication=" + sessionStorage.getItem("sessionId"),
                        contentType: "application/json",
                        data: JSON.stringify(userProfile),
                        complete: function () {
                            app.mobileApp.hideLoading();
                            console.log("Request string: " + this.url + "?" + this.data);
                        },
                        success: function (data) {
                            console.log(data);
                            window.app.mobileApp.navigate("components/userDetails/view.html", "fade");
                            navigator.notification.alert("Details successfully updated!", function () { }, "Update Details", "Ok");
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

        },
        saveEmail: function () {
            app.mobileApp.showLoading();
            $.ajax({
                type: "GET",
                url: baseUrl + "user/customer" + "?authentication=" + sessionStorage.getItem("sessionId"),
                contentType: "application/json",
                complete: function () {
                    console.log("Request string: " + this.url + "?" + this.data);
                },
                success: function (data) {
                    console.log(data);
                    let userProfile = data;
                    userProfile["email"] = app.editDetails.editDetailsModel.fields.email;
                    $.ajax({
                        type: "PUT",
                        url: baseUrl + "user/updateUserProfile/" + "?authentication=" + sessionStorage.getItem("sessionId"),
                        contentType: "application/json",
                        data: JSON.stringify(userProfile),
                        complete: function () {
                            app.mobileApp.hideLoading();
                            console.log("Request string: " + this.url + "?" + this.data);
                        },
                        success: function (data) {
                            console.log(data);
                            window.app.mobileApp.navigate("components/userDetails/view.html", "fade");
                            navigator.notification.alert("Details successfully updated!", function () { }, "Update Details", "Ok");
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
        },
        saveMobileNum: function () {
            app.mobileApp.showLoading();
            $.ajax({
                type: "GET",
                url: baseUrl + "user/customer" + "?authentication=" + sessionStorage.getItem("sessionId"),
                contentType: "application/json",
                complete: function () {
                    console.log("Request string: " + this.url + "?" + this.data);
                },
                success: function (data) {
                    console.log(data);
                    let userProfile = data;
                    userProfile["mobileNumber"] = app.editDetails.editDetailsModel.fields.mobileNum;
                    $.ajax({
                        type: "PUT",
                        url: baseUrl + "user/updateUserProfile/" + "?authentication=" + sessionStorage.getItem("sessionId"),
                        contentType: "application/json",
                        data: JSON.stringify(userProfile),
                        complete: function () {
                            app.mobileApp.hideLoading();
                            console.log("Request string: " + this.url + "?" + this.data);
                        },
                        success: function (data) {
                            console.log(data);
                            window.app.mobileApp.navigate("components/userDetails/view.html", "fade");
                            navigator.notification.alert("Details successfully updated!", function () { }, "Update Details", "Ok");
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
        },
        savePassword: function () {
            if (editDetailsModel.fields.newPassword === editDetailsModel.fields.confirmPassword) {
                $.ajax({
                    type: "PUT",
                    url: baseUrl + "user/updatePassword/" + "?authentication=" + sessionStorage.getItem("sessionId"),
                    contentType: "application/json",
                    data: JSON.stringify({ "oldPassword": editDetailsModel.fields.oldPassword, "newPassword": editDetailsModel.fields.newPassword }),
                    complete: function () {
                        app.mobileApp.hideLoading();
                        console.log("Request string: " + this.url + "?" + this.data);
                    },
                    success: function (data) {
                        console.log(data);
                        window.app.mobileApp.navigate("components/login/view.html", "fade");
                        sessionStorage.removeItem("sessionId");
                        navigator.notification.alert(
                            `
Password reset succesful!
                            
                            
Please login to generate a new session
    `, function () { }, "Reset Password", "Ok");
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
                navigator.notification.alert("New password and confirm password do no match", function () { }, "Reset error", "Ok");
            }

        }
    });
    parent.set('editDetailsModel', editDetailsModel);
})(app.editDetails);