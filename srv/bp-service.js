const cds = require("@sap/cds");

module.exports = cds.service.impl(function () {

    this.on("validateSupplier", async (req) => {

        const {
            SupplierID,
            SupplierEmail
        } = req.data;

        // Validate input
        if (!SupplierID || !SupplierEmail) {
            return false;
        }

        // Access Suppliers entity
        const { Suppliers } =
            this.entities;

        // Search supplier
        const supplier =
            await SELECT.one
                .from(Suppliers)
                .where({
                    SupplierID: SupplierID,
                    SupplierEmail: SupplierEmail
                });

        // Supplier exists
        return !!supplier;
    });

});