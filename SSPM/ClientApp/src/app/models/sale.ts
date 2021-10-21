import { Product } from './product';
import { User } from './user';
 
export class Sale{
    id: number;
    userId: number;
    user: User;
    buyer: string;
    soldProducts: Product[];
    totalPrice: number;
    discount: number; 
    finalPrice: number; 
    dateInserted: Date;
    dateUpdated: Date;
    active: boolean
}