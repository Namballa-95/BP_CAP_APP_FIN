sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/Menu",
    "sap/m/MenuItem",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/VBox",
    "sap/m/HBox"
], function (
    Controller,
    MessageBox,
    MessageToast,
    Menu,
    MenuItem,
    Dialog,
    Button,
    Label,
    Input,
    VBox,
    HBox
) {
    "use strict";

    return Controller.extend(
        "supplier.registration.supplierregistration.controller.SupplierRegistration",
        {

            // =====================================================
            // INITIALIZATION
            // =====================================================

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

                if (!this._isValidEmail(sSupplierEmail)) {
                    MessageBox.error(
                        "Please enter a valid email address."
                    );
                    return;
                }

                const oSupplier = {
                    SupplierID: sSupplierID,
                    SupplierName: sSupplierName,
                    SupplierEmail: sSupplierEmail
                };

                try {

                    const oListBinding =
                        this.oModel.bindList("/Suppliers");

                    const oContext =
                        oListBinding.create(oSupplier);

                    await oContext.created();

                    MessageToast.show(
                        "Supplier registered successfully."
                    );

                    oView.byId("supplierIdInput").setValue("");
                    oView.byId("supplierNameInput").setValue("");
                    oView.byId("supplierEmailInput").setValue("");

                    this._refreshSupplierTable();

                } catch (oError) {

                    console.error(
                        "Supplier registration failed:",
                        oError
                    );

                    MessageBox.error(
                        "Supplier registration failed.\n\n" +
                        (oError.message || "Unknown error")
                    );

                }

            },


            // =====================================================
            // SUPPLIER ACTIONS MENU
            // =====================================================

            onSupplierActions: function (oEvent) {

                const oButton = oEvent.getSource();

                const oContext =
                    oButton.getBindingContext();

                if (!oContext) {
                    MessageBox.error(
                        "Unable to identify the selected supplier."
                    );
                    return;
                }

                const oSupplierData = {
                    SupplierID: oContext.getProperty("SupplierID"),
                    SupplierName: oContext.getProperty("SupplierName"),
                    SupplierEmail: oContext.getProperty("SupplierEmail")
                };

                const oMenu = new Menu({
                    items: [
                        new MenuItem({
                            text: "Edit",
                            icon: "sap-icon://edit",
                            press: function () {
                                this._openEditSupplierDialog(
                                    oContext,
                                    oSupplierData
                                );
                            }.bind(this)
                        }),

                        new MenuItem({
                            text: "Delete",
                            icon: "sap-icon://delete",
                            press: function () {
                                this._confirmDeleteSupplier(
                                    oContext,
                                    oSupplierData
                                );
                            }.bind(this)
                        })
                    ]
                });

                this.getView().addDependent(oMenu);

                oMenu.openBy(oButton);

            },


            // =====================================================
            // EDIT SUPPLIER DIALOG
            // =====================================================

            _openEditSupplierDialog: function (
                oContext,
                oSupplierData
            ) {

                const oView = this.getView();

                const oSupplierIDInput = new Input({
                    value: oSupplierData.SupplierID || "",
                    editable: false,
                    width: "100%"
                });

                const oSupplierNameInput = new Input({
                    value: oSupplierData.SupplierName || "",
                    placeholder: "Enter supplier name",
                    width: "100%",
                    maxLength: 255
                });

                const oSupplierEmailInput = new Input({
                    value: oSupplierData.SupplierEmail || "",
                    type: "Email",
                    placeholder: "Enter supplier email",
                    width: "100%"
                });

                const oDialog = new Dialog({
                    title: "Edit Supplier",
                    contentWidth: "30rem",
                    stretchOnPhone: true,
                    draggable: true,
                    resizable: true,

                    content: [
                        new VBox({
                            width: "100%",
                            items: [
                                new Label({
                                    text: "Supplier ID",
                                    labelFor: oSupplierIDInput
                                }),
                                oSupplierIDInput,

                                new Label({
                                    text: "Supplier Name",
                                    labelFor: oSupplierNameInput
                                }).addStyleClass("sapUiSmallMarginTop"),
                                oSupplierNameInput,

                                new Label({
                                    text: "Supplier Email",
                                    labelFor: oSupplierEmailInput
                                }).addStyleClass("sapUiSmallMarginTop"),
                                oSupplierEmailInput
                            ]
                        }).addStyleClass(
                            "sapUiResponsiveContentPadding"
                        )
                    ],

                    beginButton: new Button({
                        text: "Save",
                        type: "Emphasized",

                        press: async function () {

                            const sSupplierName =
                                oSupplierNameInput.getValue().trim();

                            const sSupplierEmail =
                                oSupplierEmailInput.getValue().trim();

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

                            if (!this._isValidEmail(sSupplierEmail)) {
                                MessageBox.error(
                                    "Please enter a valid email address."
                                );
                                return;
                            }

                            try {

                                // Update the existing OData V4 entity.
                                oContext.setProperty(
                                    "SupplierName",
                                    sSupplierName
                                );

                                oContext.setProperty(
                                    "SupplierEmail",
                                    sSupplierEmail
                                );

                                await this.oModel.submitBatch(
                                    this.oModel.getUpdateGroupId()
                                );

                                MessageToast.show(
                                    "Supplier updated successfully."
                                );

                                oDialog.close();
                                this._refreshSupplierTable();

                            } catch (oError) {

                                console.error(
                                    "Supplier update failed:",
                                    oError
                                );

                                MessageBox.error(
                                    "Unable to update supplier.\n\n" +
                                    (oError.message || "Unknown error")
                                );

                            }

                        }.bind(this)
                    }),

                    endButton: new Button({
                        text: "Cancel",
                        press: function () {
                            oDialog.close();
                        }
                    }),

                    afterClose: function () {
                        oDialog.destroy();
                    }
                });

                oView.addDependent(oDialog);
                oDialog.open();

            },


            // =====================================================
            // DELETE SUPPLIER CONFIRMATION
            // =====================================================

            _confirmDeleteSupplier: function (
                oContext,
                oSupplierData
            ) {

                MessageBox.confirm(
                    "Are you sure you want to delete supplier '" +
                    oSupplierData.SupplierName +
                    "' (" + oSupplierData.SupplierID + ")?",

                    {
                        title: "Confirm Delete",

                        actions: [
                            MessageBox.Action.DELETE,
                            MessageBox.Action.CANCEL
                        ],

                        emphasizedAction: MessageBox.Action.DELETE,

                        onClose: async function (sAction) {

                            if (sAction !== MessageBox.Action.DELETE) {
                                return;
                            }

                            try {

                                // Delete the selected OData V4 entity.
                                await oContext.delete("$auto");

                                MessageToast.show(
                                    "Supplier deleted successfully."
                                );

                                this._refreshSupplierTable();

                            } catch (oError) {

                                console.error(
                                    "Supplier deletion failed:",
                                    oError
                                );

                                MessageBox.error(
                                    "Unable to delete supplier.\n\n" +
                                    (oError.message || "Unknown error")
                                );

                            }

                        }.bind(this)
                    }
                );

            },


            // =====================================================
            // REFRESH SUPPLIER TABLE
            // =====================================================

            _refreshSupplierTable: function () {

                const oTable =
                    this.getView().byId("supplierTable");

                const oBinding =
                    oTable && oTable.getBinding("items");

                if (oBinding) {
                    oBinding.refresh();
                }

            },


            // =====================================================
            // EMAIL VALIDATION
            // =====================================================

            _isValidEmail: function (sEmail) {

                const emailRegex =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                return emailRegex.test(sEmail);

            }

        }
    );
});
