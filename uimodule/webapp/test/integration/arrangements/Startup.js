sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
    "use strict";

    return Opa5.extend("com.te.ODataSalesOrdersSearch.test.integration.arrangements.Startup", {
        iStartMyApp: function () {
            this.iStartMyUIComponent({
                componentConfig: {
                    name: "com.te.ODataSalesOrdersSearch",
                    async: true,
                    manifest: true
                }
            });
        }
    });
});
