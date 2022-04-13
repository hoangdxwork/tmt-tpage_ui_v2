import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TDSHelperObject, TDSModalService } from 'tmt-tang-ui';
import { ModalImageStoreComponent } from '../../pages/conversations/components/modal-image-store/modal-image-store.component';

@Component({
  selector: 'tds-conversations',
  templateUrl: './tds-conversations.component.html',
  host: {
    class: "w-full h-full overflow-hidden flex flex-col"
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TDSConversationsComponent implements OnInit {
  @Input() tdsHeader?: string | TemplateRef<void>;

  inputValue?: string;
  
  listsfieldListAll: any = {
    id: 2,
    name: 'Nguyen Binh',
    text:'N',
    color:'bg-accent-6'
  }

  listAll: Array<any> = [
    {
      id: 1,
      name: 'Phương Mai',
      text:'P',
      color:'bg-accent-6'
    },
    {
      id: 2,
      name: 'Nguyen Binh',
      text:'N',
      color:'bg-accent-4'
    },
    {
      id: 3,
      name: 'Nguyen Bao',
      text:'N',
      color:'bg-accent-5'
    },
    {
      id: 4,
      name: 'Hong Dao',
      text:'H',
      color:'bg-accent-8'
    },
    {
      id: 5,
      name: 'Admin',
      text:'A',
      color:'bg-accent-6'
    },
    {
      id: 6,
      name: 'Thien',
      text:'B',
      color:'bg-accent-5'
    },
  ]

  constructor(private modalService: TDSModalService, 
              private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    setTimeout(() => {
      
    }, 2000);
    this.showImageStore()
  }

  onClickFieldListAll(str: string) {
    this.listsfieldListAll = str;
  }

  onClickDropdown(e: MouseEvent) {
    e.stopPropagation();
  } 

  showImageStore(): void {
    const modal = this.modalService.create({
        title: 'Kho hình ảnh',
        content: ModalImageStoreComponent,
        size: "xl",
        centered: true,
        viewContainerRef: this.viewContainerRef,      
        componentParams: {
            // data: this.person
        }
    });
    // modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    // Return a result when closed
    // modal.afterClose.subscribe(result => {
    //     console.log('[afterClose] The result is:', result);
    //     if (TDSHelperObject.hasValue(result)) {
    //         this.person = Object.assign(this.person, result);
    //     }
    // });
}

}
