import { FilterItem } from "./filter-item";

export class Filter {
    first: number;
    rows: number;
    filterItems : FilterItem[];

    constructor(rows) {
        this.first=0;
        this.rows = rows;
    }

}