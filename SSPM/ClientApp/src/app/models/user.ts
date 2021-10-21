import { Product } from './product';
import { Role } from "./role";
import { Transaction } from './transaction';
import { Servicing } from './servicing';

export class User {
    public id: number;
    public firstName: string;
    public lastName: string;
    public username: string;
    public password: string;
    public roleId: number;
    public role: Role;
    public dateInserted: string;
    public dateUpdated: string;
    public active: number;
    public products: Product[];
    public transactions: Transaction[];
    public servicings: Servicing[];

}