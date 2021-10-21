import { Filter } from './filter';
export class FilterItem {
    property: string;
    value: string;
    type: filterType;

    constructor(prop, type) {
        this.property = prop;
        this.type = type
    }

}

export enum filterType{

    text= 1,
    number = 2,
    date = 3,
    brand = 4,
    category = 5,
    role = 6,
    transactionType = 7,
    dateFrom = 8,
    dateTo = 9,
    supplier = 10
    
}