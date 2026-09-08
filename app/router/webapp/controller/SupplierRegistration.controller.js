sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (
    Controller,
    MessageBox,
    MessageToast
) {
    "use strict";

    return Controller.extend(
        "supplier.registration.supplierregistration.controller.SupplierRegistration",
        {

            onInit: function () {

                this.oModel =
                    this.getOwnerComponent().getModel();

                console.log(
                    "OData V4 Model:",
                    this.oModel
                );

            },


            // =====================================================
            // NAVIGATION
            // =====================================================

            onNavigateToRegister: function () {

                this.getOwnerComponent()
                    .getRouter()
                    .navTo("RouteSupplierRegistration");

            },


            onNavigateToSuppliers: function () {

                this.getOwnerComponent()
                    .getRouter()
                    .navTo("RouteSuppliers");

            },


            // =====================================================
            // EXISTING SUPPLIER REGISTRATION
            // DO NOT CHANGE
            // =====================================================

            onRegisterSupplier: async function () {

                const oView = this.getView();

                const sSupplierID =
                    oView.byId("supplierIdInput")
                        .getValue()
                        .trim();

                const sSupplierName =
                    oView.byId("supplierNameInput")
                        .getValue()
                        .trim();

                const sSupplierEmail =
                    oView.byId("supplierEmailInput")
                        .getValue()
                        .trim();


                // -----------------------------
                // Validation
                // -----------------------------

                if (!sSupplierID) {

                    MessageBox.error(
                        "Please enter Supplier ID."
                    );

                    return;
                }


                if (!sSupplierName) {

                    MessageBox.error(
                        "Please enter Supplier Name."
                    );

                    return;
                }


                if (!sSupplierEmail) {

                    MessageBox.error(
                        "Please enter Supplier Email."
                    );

                    return;
                }


                // -----------------------------
                // Email validation
                // -----------------------------

                const emailRegex =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(sSupplierEmail)) {

                    MessageBox.error(
                        "Please enter a valid email address."
                    );

                    return;
                }


                // -----------------------------
                // Supplier data
                // -----------------------------

                const oSupplier = {

                    SupplierID: sSupplierID,

                    SupplierName: sSupplierName,

                    SupplierEmail: sSupplierEmail

                };


                try {

                    // -----------------------------
                    // Create OData V4 binding
                    // -----------------------------

                    const oListBinding =
                        this.oModel.bindList(
                            "/Suppliers"
                        );


                    // -----------------------------
                    // Create entity
                    // -----------------------------

                    const oContext =
                        oListBinding.create(
                            oSupplier
                        );


                    // -----------------------------
                    // Wait for backend
                    // -----------------------------

                    await oContext.created();


                    // -----------------------------
                    // Success
                    // -----------------------------

                    MessageToast.show(
                        "Supplier registered successfully."
                    );


                    // -----------------------------
                    // Clear form
                    // -----------------------------

                    oView.byId(
                        "supplierIdInput"
                    ).setValue("");

                    oView.byId(
                        "supplierNameInput"
                    ).setValue("");

                    oView.byId(
                        "supplierEmailInput"
                    ).setValue("");


                    // -----------------------------
                    // Refresh table
                    // -----------------------------

                    const oTable =
                        oView.byId(
                            "supplierTable"
                        );

                    const oBinding =
                        oTable.getBinding(
                            "items"
                        );

                    if (oBinding) {

                        oBinding.refresh();

                    }


                } catch (oError) {

                    console.error(
                        "Supplier registration failed:",
                        oError
                    );


                    MessageBox.error(
                        "Supplier registration failed.\n\n" +
                        (
                            oError.message ||
                            "Unknown error"
                        )
                    );

                }

            }

        }
    );
});