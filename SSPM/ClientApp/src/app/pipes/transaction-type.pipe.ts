import { TransactionType } from './../models/transaction';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionType'
})
export class TransactionTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    
    if (TransactionType[value] == 'supply') return 'Furnizim' ;
    else return 'Shitje'; 
  }

}
