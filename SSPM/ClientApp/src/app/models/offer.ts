import { Product } from "./product";
import { DiscountType } from "./transaction";
import { OfferProduct } from "./offerProduct";
 

export class Offer{
    id: number;
    totalPrice: number;
    discount: number; 
    discountType: DiscountType;
    finalPrice: number; 
    offerReceiver: string;
    offerProducts: OfferProduct[];
    dateInserted: Date;
    dateUpdated: Date;
    active: boolean
} 