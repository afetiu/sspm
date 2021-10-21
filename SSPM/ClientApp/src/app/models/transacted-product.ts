import { Supplier } from './supplier';
import { Brand } from "./brand";
import { Category } from "./category";
import { DiscountType } from './transaction';

export class TransactedProduct{

    id: number;
    model: string;
    barcode: string;
    brandId: number;
    brand: Brand;
    categoryId: number;
    category: Category;
    supplierId: number;
    supplier: Supplier;
    transactionPrice: number; 
    transactionQuantity: number;
    description: string;

    dateInserted: Date;
    dateUpdated: Date;
    active : boolean;
}
 