import { Pipe, PipeTransform } from '@angular/core';

interface InvoiceType {
    Id: number;
    Number: string;
    ShowState: string;
    State: string;
}

@Pipe({
  name: 'invoiceList'
})

export class InvoiceListPipe implements PipeTransform {

  constructor(){}

  transform(data: InvoiceType[], from?: number, to?: number): string {
    let result = '';
    
    if(data) {
      if(!from) {
        from = 0;
      }

      if(!to || data.length - 1 < to) {
        to = data.length - 1;
      }
  
      for (let i = from; i <= to; i++) {
        if(result != ''){
            result += `<span class="text-black pr-1">,</span>`;
        }

        result += `<span class="text-primary-1 font-semibold hover:underline hover:cursor-pointer">${data[i].Number}</span>`;
      }
      
    }

    if(result != '') {
      return `<div class="flex flex-wrap items-center">
                ${result}
              </div>`
    } else {
      return result;
    }
  }

  getabc(invoiceNumber: string){
    console.log(invoiceNumber)
  }
}