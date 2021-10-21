import { Brand } from "./brand";
import { Category } from "./category";
import { Supplier } from "./supplier";
import { Offer } from "./offer";

export class OfferProduct{ 

        id: number;
        model: string;
        barcode: string;
        brandId: number;
        brand: Brand;
        categoryId: number;
        category: Category;
        supplierId: number;
        supplier: Supplier;
        offerPrice: number; 
        offerQuantity: number;
        offerId: number;
        offer: Offer;
        description: string;
    
        dateInserted: Date;
        dateUpdated: Date;
        active : boolean;
    }       