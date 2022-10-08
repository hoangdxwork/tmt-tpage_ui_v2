import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ODataPartnerStartusDTO, PartnerStatusDTO } from '@app/dto/partner/partner-status.dto';
import { PartnerService } from '@app/services/partner.service';
import { Subject, takeUntil } from 'rxjs';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperObject } from 'tds-ui/shared/utility';
import { CreatePartnerStatusComponent } from '../components/create-partner-status/create-partner-status.component';

@Component({
  selector: 'app-config-partner-status',
  templateUrl: './config-partner-status.component.html',
  host: {
    class: 'w-full h-full flex'
  }
})
export class ConfigPartnerStatusComponent implements OnInit {
  private destroy$ = new Subject<void>();

  lstData!: PartnerStatusDTO[];

  constructor(
    private partnerService: PartnerService,
    private modalService: TDSModalService,
    private message: TDSMessageService,
    private viewContainerRef: ViewContainerRef,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.partnerService.getPartnerStatusExtra().subscribe({
      next: (res: ODataPartnerStartusDTO) => {
        this.lstData = [...res.value];
      }
    })
  }

  showRemoveStatus(data: PartnerStatusDTO) {
    const modal = this.modalService.error({
      title: 'Xác nhận xóa trạng thái',
      content: 'Bạn có chắc muốn xóa trạng thái khách hàng này không?',
      iconType: 'tdsi-trash-fill',
      onOk: () => {
        this.partnerService.deletePartnerStatusExtra(data.Id).pipe(takeUntil(this.destroy$)).subscribe(
          (res) => {
            this.message.success('Xóa thành công');
            this.loadData();
          },
          err => {
            this.message.error(err.error.message || "Xóa thất bại !!");
          }
        );
      },
      onCancel: () => {
        modal.close();
      },
      okText: "Xác nhận",
      cancelText: "Hủy bỏ"
    });
  }

  showCreateModal() {
    const modal = this.modalService.create({
      title: 'Thêm mới trạng thái khách hàng',
      content: CreatePartnerStatusComponent,
      viewContainerRef: this.viewContainerRef,
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
      this.loadData();
    });
  }

  showEditModal(data: PartnerStatusDTO): void {
    const modal = this.modalService.create({
      title: 'Chỉnh sửa trạng thái khách hàng',
      content: CreatePartnerStatusComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        data: data
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
      this.loadData();
    });
  }

}
