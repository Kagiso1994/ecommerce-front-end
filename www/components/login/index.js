app.login = kendo.observable({
    onShow: function() {
        $(".km-button").hide();
        localStorage.setItem("screen","login");
        app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar").title("Login");
       // let screenSize = window.innerHeight;
        let divHeight = 0.38 * window.innerHeight;
        $(".login-top-div").css("height", divHeight + 'px');
        
        // app.login.loginModel.fields.set('username', 'gola@gmail.com');
        // app.login.loginModel.fields.set('password', '12345');
        M.updateTextFields();
	},
    afterShow: function() {
        
    }
});

(function (parent) {
    var loginModel = kendo.observable({
        fields: {
            'username': '',
            'password': ''
        },
        login: function (){
           var loginData = {
                email: loginModel.fields.username,
                password: loginModel.fields.password
            };
            console.log(loginData)
            app.mobileApp.showLoading();
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
        signup: function (){
            window.app.mobileApp.navigate("components/register/view.html", "fade");
        }
	});
    parent.set('loginModel', loginModel);
})(app.login);