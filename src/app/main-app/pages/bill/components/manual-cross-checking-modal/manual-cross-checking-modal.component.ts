import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { CrossCheckingDTO, CrossCheckingOrder, ExistedCrossChecking } from './../../../../dto/fastsaleorder/cross-checking.dto';
import { TDSSafeAny, TDSModalRef, TDSMessageService, TDSHelperString } from 'tmt-tang-ui';
import { DeliveryCarrierDTOV2 } from './../../../../dto/delivery-carrier.dto';
import { fromEvent, Observable } from 'rxjs';
import { map, debounceTime, switchMap } from 'rxjs/operators';
import { DeliveryCarrierService } from './../../../../services/delivery-carrier.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-manual-cross-checking-modal',
  templateUrl: './manual-cross-checking-modal.component.html'
})
export class ManualCrossCheckingModalComponent implements OnInit {

  @ViewChild('filterText') filterText!: ElementRef;
  listOfData:CrossCheckingOrder[] = [];
  listTempOfData:CrossCheckingOrder[] = [];
  modelData!:CrossCheckingDTO;
  lstCarriers!: Observable<DeliveryCarrierDTOV2[]>;
  public lstShipStatus: any[] = [
    {value:'refund', text:'Hàng trả về'},
    {value:'sent', text:'Đã tiếp nhận'},
    {value:'done', text:'Đã thu tiền'}
  ]
  _form!: FormGroup;
  hasTrackingRefError:string = '';

  constructor(private fb: FormBuilder,
    private modal: TDSModalRef,
    private deliveryCarrierService: DeliveryCarrierService,
    private fashSaleOrder: FastSaleOrderService,
    private message: TDSMessageService
    ) { 
    this.createForm();
  }

  ngOnInit(): void {
    this.loadDefaultData();
    this.lstCarriers = this.loadCarrier();
  }

  createForm(){
    this._form = this.fb.group({
      carrierId:[null],
      shipStatus:[{value:'sent', text:'Đã tiếp nhận'}],
      note:[null],
      payment:[false],
      isNoteOrder:[false]
    });
  }

  loadDefaultData(){
    this.modelData = {
      datas: [],
      carrierId: 0,
      note: '',
      payment: false,
      isNoteOrder: false,
    };
  }

  loadCarrier() {
    return this.deliveryCarrierService.get().pipe(map(res => res.value));
  }

  checkExistTrackingRef(event:TDSSafeAny,index:number){
    if(!TDSHelperString.hasValueString(event.value)){
      this.listTempOfData[index].hasError = 'Vui lòng nhập mã vận đơn';
      return;
    }

    let duplicateTrackingRef = this.listOfData.find(f=>f.TrackingRef == event.value);
          
    if(duplicateTrackingRef){
      this.message.warning('Trùng mã vận đơn');
    }

    let formModel = this._form.value;
    let status = formModel.shipStatus.text.split(' ').join('+');
    // TODO: Kiểm tra mã vận đơn
    this.fashSaleOrder.checkTrackingRefIsExist(event.value,status,formModel.carrierId).subscribe(
      (res:any)=>{
        delete res['@odata.context'];
        let model = res as ExistedCrossChecking;
        
        if(this.listOfData[index]){
          // TODO: trường hợp chỉnh sửa trackingRef
          this.listOfData[index].TrackingRef = model.TrackingRef || event.value;
          this.listOfData[index].CoDAmount = model.COD;
          this.listOfData[index].Note = model.Message;
          this.listOfData[index].ShipStatus = formModel.shipStatus.text;
          this.listTempOfData = [...this.listOfData];
          // TODO: show lỗi
          this.listTempOfData[index].hasError = model.Message;
        }else{
          // TODO: trường hợp thêm mới trackingRef
          this.listOfData.push({
            TrackingRef: model.TrackingRef || event.value,
            CoDAmount: model.COD,
            Note: model.Message,
            ShipStatus: formModel.shipStatus.text
          })

          this.listTempOfData = [...this.listOfData];
          // TODO: show lỗi
          this.listTempOfData[index].hasError = model.Message;
        }
        
        
      },
      (err)=>{
        this.message.error(err.error.message || 'Có lỗi xảy ra');
      }
    )
    
  }

  removeCrossChecking(index:number){
    this.listOfData.splice(index,1);
    this.listOfData = [...this.listOfData];
    this.listTempOfData = this.listOfData;
  }

  removeAllCrossChecking(){
    this.listOfData = [];
    this.listTempOfData = this.listOfData;
  }

  onOrderFilter(event:TDSSafeAny){
    this.listTempOfData = this.listTempOfData.filter(f=>f.TrackingRef?.includes(event.value) || 
      f.ShipStatus?.includes(event.value) || 
      f.CoDAmount?.toString().includes(event.value));
  }

  createDetails(){
    let isEmptyTrackingRef = this.listOfData.find(f=>f.TrackingRef == '');
    if(!isEmptyTrackingRef){
      this.listTempOfData = [...this.listOfData,{
        TrackingRef: '',
        CoDAmount: 0,
        Note: '',
        ShipStatus: 'Đã tiếp nhận'
      }];
    }else{
      this.message.error('Vui lòng nhập mã vận đơn');
    }
  }

  prepareModel(){
    let formModel = this._form.value;

    this.modelData.carrierId = formModel.carrierId ? formModel.carrierId : this.modelData.carrierId;
    this.modelData.note =  formModel.note ? formModel.note : this.modelData.note;
    this.modelData.payment = formModel.payment;
    this.modelData.isNoteOrder = formModel.isNoteOrder;
    this.modelData.datas = [];
    this.listOfData.forEach(data => {
      if(data.TrackingRef){
        this.modelData.datas.push(data);
      }
    });
    return this.modelData;
  }

  checkErrorOrderList(model:CrossCheckingDTO){
    if(!model.carrierId){
      this.message.error('Vui lòng chọn đối tác giao hàng');
      return false;
    }

    if(model.datas){
      let hasError = true;
      model.datas.forEach(order => {
        if(order.Note === 'Không tìm thấy vận đơn'){
          this.message.error(`Không tìm thấy vận đơn [${order.TrackingRef}]`);
          hasError = false;
        }
      });
      return hasError;
    }else{
      this.message.error('Danh sách đối soát rỗng');
      return false;
    }
  }

  updateCrossChecking(){
    let model = this.prepareModel();
    // TODO: check validate
    if(this.checkErrorOrderList(model)){
      model.datas.forEach(order => {
        delete order["hasError"];
      });

      this.fashSaleOrder.postManualCrossChecking(model).subscribe(
        (res:any)=>{
          this.modal.destroy(null);
        },
        (err)=>{
          this.message.error(err?.error?.message || 'Lỗi dữ liệu. Không thể tạo đối soát thủ công');
        }
      )
    }
  }

  save(){
    this.updateCrossChecking();
  }

  cancel(){
    this.modal.destroy(null);
  }
}
