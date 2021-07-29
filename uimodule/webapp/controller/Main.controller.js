/* eslint-disable no-trailing-spaces */
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/json/JSONModel",
  "sap/m/ColumnListItem",
  "sap/m/Label",
  "sap/m/Token",
  "sap/ui/model/type/String",
  "sap/ui/integration/designtime/baseEditor/validator/MaxLength"
], function (Controller,
  Filter,
  FilterOperator,
  JSONModel,
  ColumnListItem,
  Label,
  Token,
  String) {
  "use strict";

  return Controller.extend("com.te.ODataSalesOrdersSearch.controller.Main", {
    onInit: function () {
      var headerFragment = sap.ui.xmlfragment(this.getView().getId(), "com.te.ODataSalesOrdersSearch.view.Items", this);
      this.getView().byId("main").insertContent(headerFragment, 1);
      var filterFragment = sap.ui.xmlfragment(this.getView().getId(), "com.te.ODataSalesOrdersSearch.view.Filter", this);
      this.getView().byId("main").insertContent(filterFragment, 0);
      this._oMultiInput = this.getView().byId("delStatus");

      this._oInput = this.getView().byId("busPart");
      var oCols = {
        "cols": [
          {
            "label": "Business Partner ID",
            "template": "BusinessPartnerID",
            "width": "5rem"
          },
          {
            "label": "Company Name",
            "template": "CompanyName"
          },
          {
            "label": "Email Address",
            "template": "EmailAddress"
          }
        ]
      };
      this.oColModel = new JSONModel(oCols);
    },

    onSearch: function () {
      var oModel = this.getView().getModel();
      var oDataFilter = new Array();
      var salesOrderTable = this.getView().byId("idSalesOrderTable");
      oDataFilter.push(
        new Filter("CustomerID", FilterOperator.EQ, this.getView().byId("busPart").getValue())
      );
      oDataFilter.push(
        new Filter("BillingStatus", FilterOperator.EQ, this.getView().byId("bilStatus").getValue())
      );
      oDataFilter.push(
        new Filter("DeliveryStatus", FilterOperator.EQ, this.getView().byId("delStatus").getValue())
      );
      var oQueryFilter = new Array(
        new Filter({
          filters: oDataFilter,
          and: true
        })
      );
      salesOrderTable.setModel(oModel);
      salesOrderTable.bindAggregation("items", {
        path: "/SalesOrderSet",
        filters: oQueryFilter,
        template: this.getView().byId("sales"),
        parameters: {
          top: 10
        }
      });
    },
    onValueHelpRequested: function () {
      var aCols = this.oColModel.getData().cols;

      this._oValueHelpDialog = sap.ui.xmlfragment("com.te.ODataSalesOrdersSearch.view.BPHelp", this);
      this.getView().addDependent(this._oValueHelpDialog);

      this._oValueHelpDialog.getTableAsync().then(function (oTable) {
        oTable.setModel(this.getView().getModel());
        oTable.setModel(this.oColModel, "columns");

        if (oTable.bindRows) {
          oTable.bindAggregation("rows", "/BusinessPartnerSet");
        }

        if (oTable.bindItems) {
          oTable.bindAggregation("items", "/BusinessPartnerSet", function () {
            return new ColumnListItem({
              cells: aCols.map(function (column) {
                return new Label({
                  text: "{" + column.template + "}"
                });
              })
            });
          });
        }
        this._oValueHelpDialog.update();
      }.bind(this));

      var oToken = new Token();
      oToken.setKey(this._oInput.getSelectedKey());
      oToken.setText(this._oInput.getValue());
      this._oValueHelpDialog.setTokens([oToken]);
      this._oValueHelpDialog.open();
    },
    onValueHelpRequestedDel: function () {
      this._oValueHelpDialogDel = sap.ui.xmlfragment("com.te.ODataSalesOrdersSearch.view.DelHelp", this);
      this.getView().addDependent(this._oValueHelpDialogDel);
      this._oValueHelpDialogDel.setRangeKeyFields([{
        label: "Delivery Status",
        key: "DelStatus",
        type: "string",
        typeInstance: new String({}, {
          maxLength: 1
        })
      }]);
      this._oValueHelpDialogDel.setTokens(this._oMultiInput.getTokens());
      this._oValueHelpDialogDel.open();
    },
    onValueHeloOkPressDel: function (oEvent) {
      var aTokens = oEvent.getParameter("tokens");
      this._oMultiInput.setTokens(aTokens);
      this._oValueHelpDialogDel.close();
    },
    onValueHelpCalcelPressDel: function () {
      this._oValueHelpDialogDel.close();
    },
    onValueHelpAfterCloseDel: function () {
      this._oValueHelpDialogDel.destroy();
    },
    onValueHelpOkPress: function (oEvent) {
      var aTokens = oEvent.getParameter("tokens");
      this._oInput.setSelectedKey(aTokens[0].getKey());
      this._oValueHelpDialog.close();
    },
    onValueHelpCancelPress: function () {
      this._oValueHelpDialog.close();
    },
    onValueHelpAfterClose: function () {
      this._oValueHelpDialog.destroy();
    }
  });

});
