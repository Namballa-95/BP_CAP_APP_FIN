const cds = require("@sap/cds");

const { SELECT } = cds.ql;

module.exports = cds.service.impl(function () {

    // =========================================================
    // VALIDATE SUPPLIER
    // =========================================================

    this.on("validateSupplier", async (req) => {
        try {
            const SupplierID = String(
                req.data.SupplierID || ""
            ).trim();

            const SupplierEmail = String(
                req.data.SupplierEmail || ""
            ).trim().toLowerCase();

            if (!SupplierID || !SupplierEmail) {
                return false;
            }

            const { Suppliers } = this.entities;

            const supplier = await SELECT.one
                .from(Suppliers)
                .where({
                    SupplierID: SupplierID
                });

            return !!supplier &&
                String(supplier.SupplierEmail || "")
                    .trim()
                    .toLowerCase() === SupplierEmail;

        } catch (error) {
            console.error(
                "VALIDATE SUPPLIER ERROR:",
                error.message
            );

            throw error;
        }
    });


    // =========================================================
    // GET LOGGED-IN SUPPLIER
    // =========================================================

    this.on("getMySupplier", async (req) => {
        try {
            console.log("==============================================");
            console.log("GET MY SUPPLIER");
            console.log("User ID:", req.user?.id);
            console.log("User Email:", req.user?.email);
            console.log("==============================================");

            // 1. Check authentication
            const user = req.user;

            if (!user || user.id === "anonymous") {
                return req.reject(
                    401,
                    "User is not authenticated."
                );
            }

            // 2. Resolve logged-in user's email
            const email = String(
                user.email ||
                user.attr?.email ||
                user.id ||
                ""
            ).trim().toLowerCase();

            console.log("Resolved login email:", email);

            if (!email || !email.includes("@")) {
                return req.reject(
                    400,
                    "Unable to determine the email address of the logged-in user."
                );
            }

            // 3. Find registered supplier by email
            const { Suppliers } = this.entities;

            const supplier = await SELECT.one
                .from(Suppliers)
                .where({
                    SupplierEmail: email
                });

            // 4. Check supplier registration
            if (!supplier) {
                console.error(
                    "No supplier registered for email:",
                    email
                );

                return req.reject(
                    403,
                    "This email is not registered. Please contact the administrator."
                );
            }

            // 5. Return the registered portal SupplierID
            const supplierID = String(
                supplier.SupplierID || ""
            ).trim();

            console.log("Portal Supplier ID:", supplierID);
            console.log("Supplier email:", email);

            return supplierID;

        } catch (error) {
            if (error.status) {
                throw error;
            }

            console.error("GET MY SUPPLIER ERROR:", error);

            return req.reject(
                500,
                "Unable to retrieve the logged-in supplier."
            );
        }
    });

});