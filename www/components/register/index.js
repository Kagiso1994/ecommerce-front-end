app.register = kendo.observable({
    onShow: function () {
        $(".km-button").show();
        localStorage.setItem("screen", "register");
        app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar").title("register");
        // let screenSize = window.innerHeight;
        let divHeight = 0.38 * window.innerHeight;
        $(".register-top-div").css("height", divHeight + 'px');
        M.updateTextFields();
    },
    afterShow: function () {

    }
});

(function (parent) {
    var registerModel = kendo.observable({
        fields: {
            'firstname': '',
            'lastname': '',
            'username': '',
            'password': '',
            'confirmPassword': ''
        },
        register: function () {
            let validator = $("#registerForm").kendoValidator({

            }).data("kendoValidator");

            if (validator.validate()) {
                if (registerModel.fields.password === registerModel.fields.confirmPassword) {
                    let user = {
                        firstName: registerModel.fields.firstname,
                        lastName: registerModel.fields.lastname,
                        email: registerModel.fields.username,
                        password: registerModel.fields.password
                    }

                    app.mobileApp.showLoading();
                    $.ajax({
                        type: "POST",
                        url: baseUrl + "user/signup",
                        data: JSON.stringify(user),
                        contentType: "application/json",
                        complete: function () {
                            //app.mobileApp.hideLoading();
                            console.log("Request string: " + this.url + "?" + this.data);
                        },
                        success: function (data) {
                            console.log(data);
                            var loginData = {
                                email:  registerModel.fields.username,
                                password: registerModel.fields.password
                            };
                            app.mobileApp.hideLoading();
                            $.ajax({
                                type: "POST",
                                url: baseUrl + "user/signin",
                                data: JSON.stringify(loginData),
                                contentType: "application/json",
                                complete: function () {
                                    app.mobileApp.hideLoading();
                                    console.log("Request string: " + this.url + "?" + this.data);
                
                                },
                                success: function (data) {
                                    console.log(data);
                                    sessionStorage.setItem("sessionId", data.token);
                                    navigator.notification.alert("Registration successful!", function () { }, "Registration Success", "Ok");
                                    window.app.mobileApp.navigate("components/categories/view.html", "fade");                   
                                },
                                error: function (d, e, c) {
                                    console.log(d);
                                    console.log(e);
                                    console.log(c);
                                    navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : e, function () { }, e, "Ok")
                                }
                            });
                        },
                        error: function (d, e, c) {
                            console.log(d);
                            console.log(e);
                            console.log(c);
                            navigator.notification.alert(d.hasOwnProperty('responseJSON') ? d.responseJSON.error : e, function () { }, e, "Ok")
                        }
                    });

                } else {
                    navigator.notification.alert("Password and confirm password do not match", function () { }, "error", "Ok")
                }
            }
        },
        alreadyRegistered: function () {
            window.app.mobileApp.navigate("components/login/view.html", "fade");
        }
    });
    parent.set('registerModel', registerModel);
})(app.register);