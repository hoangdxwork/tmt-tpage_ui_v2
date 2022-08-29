import { BehaviorSubject } from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class CopyBillHandler{

public onCopyInvoice$ = new BehaviorSubject<any>(null);

  constructor() { }

  public setCopyData(data: any){
    this.onCopyInvoice$.next(data);

    if(!data){
      this.onCopyInvoice$.error('Sao chép thất bại');
    }
  }
}