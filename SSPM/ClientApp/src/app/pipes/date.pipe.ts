import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformDate'
})
export class DatePipe implements PipeTransform {

  transform(value: Date, args?: any): any { 
    return  value;
  }
}
