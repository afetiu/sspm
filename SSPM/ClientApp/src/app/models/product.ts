import { Supplier } from './supplier';
import { Category } from './category';
import { Brand } from "./brand";
import { User } from './user';


export class Product {
    public id: number;
    public model: string;
    public barcode: string;
    public brandId: number;
    public brand: Brand; 
    public supplierId: number;
    public supplier: Supplier;
    public categoryId: number;
    public category: Category;
    public salePrice: number;
    public quantity: number;
    public description: string;
    public supplyPrice: number;
    public userId: number;
    public user: User;
    public dateInserted: Date;
    public dateUpdated: Date;
    public active: boolean;
} 
 