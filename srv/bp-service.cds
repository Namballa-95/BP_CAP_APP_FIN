using bp from '../db/schema';

@path: '/bp'
service BPService {

    entity Suppliers as projection on bp.Suppliers;

    function validateSupplier(
        SupplierID    : String(20),
        SupplierEmail : String(150)
    ) returns Boolean;

}