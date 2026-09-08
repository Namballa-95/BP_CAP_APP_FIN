sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (
    Controller,
    Filter,
    FilterOperator
) {
    "use strict";

    return Controller.extend(
        "supplier.registration.supplierregistration.controller.Suppliers",
        {

            onInit: function () {

                this.oModel =
                    this.getOwnerComponent().getModel();

            },

            // ==========================================
            // SEARCH SUPPLIERS
            // ==========================================

            onSearchSuppliers: function () {

                const oView = this.getView();

                const sSupplierID =
                    oView.byId("filterSupplierId")
                        .getValue()
                        .trim();

                const sSupplierName =
                    oView.byId("filterSupplierName")
                        .getValue()
                        .trim();

                const sSupplierEmail =
                    oView.byId("filterSupplierEmail")
                        .getValue()
                        .trim();

                const aFilters = [];

                if (sSupplierID) {
                    aFilters.push(
                        new Filter(
                            "SupplierID",
                            FilterOperator.Contains,
                            sSupplierID
                        )
                    );
                }

                if (sSupplierName) {
                    aFilters.push(
                        new Filter(
                            "SupplierName",
                            FilterOperator.Contains,
                            sSupplierName
                        )
                    );
                }

                if (sSupplierEmail) {
                    aFilters.push(
                        new Filter(
                            "SupplierEmail",
                            FilterOperator.Contains,
                            sSupplierEmail
                        )
                    );
                }

                const oTable =
                    oView.byId("suppliersTable");

                const oBinding =
                    oTable.getBinding("items");

                if (oBinding) {
                    oBinding.filter(aFilters);
                }
            },

            // ==========================================
            // CLEAR FILTERS
            // ==========================================

            onClearFilters: function () {

                const oView = this.getView();

                oView.byId("filterSupplierId")
                    .setValue("");

                oView.byId("filterSupplierName")
                    .setValue("");

                oView.byId("filterSupplierEmail")
                    .setValue("");

                const oTable =
                    oView.byId("suppliersTable");

                const oBinding =
                    oTable.getBinding("items");

                if (oBinding) {
                    oBinding.filter([]);
                }
            },

            // ==========================================
            // BACK TO REGISTER
            // ==========================================

            onNavigateToRegister: function () {

                this.getOwnerComponent()
                    .getRouter()
                    .navTo("RouteSupplierRegistration");
            },

            // ==========================================
            // NAVIGATION BUTTON
            // ==========================================

            onToggleNavigation: function () {

                this.getOwnerComponent()
                    .getRouter()
                    .navTo("RouteSupplierRegistration");
            }

        }
    );
});