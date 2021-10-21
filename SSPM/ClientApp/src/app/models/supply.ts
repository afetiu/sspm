import { SuppliedProduct } from './suppliedProduct';
import { Product } from './product';
import { Supplier } from "./supplier";
import { User } from "./user";
  
    export class Supply{
        id:number;
        totalPrice: number;
        userId: number;
        user: User;
        supplierId: number;
        supplier: Supplier;
        suppliedProducts: SuppliedProduct[];
        dateInserted: Date;
        dateUpdated: Date;
        active: boolean
    }