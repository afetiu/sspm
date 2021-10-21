import { Product } from './product';
import { User } from './user';
import { TransactedProduct } from './transacted-product';
export class Transaction {
    id: number;
    transactionType: TransactionType; 
    totalQuantity: number;
    initialPrice: number;
    discount: number;
    discountType: DiscountType;
    totalPrice: number;
    client: string;
    userId: number;
    user: User;
    transactedProducts: TransactedProduct[]
    
    dateInserted: Date;
    dateUpdated: Date;
    active : boolean;
}

export enum TransactionType {
    sale = 1,
    supply = 2
}

export enum DiscountType {
    percentage = 1,
    euro = 2
}