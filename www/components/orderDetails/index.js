app.orderDetails = kendo.observable({
    onShow: function () {
        $(".km-button").show();
        localStorage.setItem("screen", "orderDetails");
        app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar").title("Order Details");

        let sessionOrder = JSON.parse(sessionStorage.getItem("sessionOrder"));

        $("#placedText").text(`Your order ${sessionOrder.id} was placed for delivery.`);
        $("#pendingText").text(`Your order is pending for confirmation. Will be confirmed within 5 minutes.`);
        $("#confirmedText").text(`Your order is confirmed and will be delivered soon within 20 minutes.`);
        $("#processingText").text(`Your order is being processed to be delivered`);
        $("#deliveredText").text(`Order delivered`);

        $("#placedCheck").css("color", "green");

        if(sessionOrder.status === "pending"){
            $("#pendingCheck").css("color", "green");
        }

        if(sessionOrder.status === "confirm"){
            $("#pendingCheck").css("color", "green");
            $("#confirmedCheck").css("color", "green");
        }

        if (sessionOrder.status === "processing") {
            $("#pendingCheck").css("color", "green");
            $("#confirmedCheck").css("color", "green");
            $("#processingCheck").css("color", "green");
        }

        if(sessionOrder.status === "delivered" && sessionOrder.payment === "paid"){
            $("#pendingCheck").css("color", "green");
            $("#confirmedCheck").css("color", "green");
            $("#processingCheck").css("color", "green");
            $("#deliveredCheck").css("color", "green");
        }
    },
    afterShow: function () {

    }
});

(function (parent) {
    var orderDetailsModel = kendo.observable({
        back: function () {
            //window.app.mobileApp.navigate("components/orderDetails/view.html", "fade");
        },

    });
    parent.set('orderDetailsModel', orderDetailsModel);
})(app.orderDetails);
