namespace bp;

using { cuid, managed } from '@sap/cds/common';

entity Suppliers : cuid, managed {

    SupplierID    : String(20)  @mandatory;
    SupplierName  : String(100) @mandatory;
    SupplierEmail : String(150) @mandatory;
}