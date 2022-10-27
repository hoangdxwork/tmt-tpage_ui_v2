import { OnChanges, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { AttachmentType } from 'src/app/lib/consts/show-attachment';
import { AttachmentHelper } from 'src/app/lib/utility/attachment.helper';

@Component({
  selector: 'show-attachment',
  templateUrl: './show-attachment.component.html',
})
export class ShowAttachmentComponent implements OnInit, OnChanges {

  @Input() type!: string;
  @Input() url!: string;
  @Input() height!: string;
  @Input() width!: string;
  @Input() isMuted: boolean = true;
  @Input() isControls: boolean = true;
  @Output() onError: EventEmitter<any> = new EventEmitter<any>();

  public currentType!: string;
  public enumAttachmentType = AttachmentType;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentType = this.getAttachmentType(changes.type.currentValue);
  }

  ngOnInit(): void {
  }

  error() {
    this.onError.emit();
  }

  getAttachmentType(type: string) {
    let getType = AttachmentHelper.getType(type);
    if (getType) return getType;

    let typeGetByUrl = AttachmentHelper.getTypeByUrl(this.url);
    if (typeGetByUrl) return typeGetByUrl;

    // Nếu không tìm thấy mặc định trả về loại hình ảnh
    return AttachmentType.IMAGE_JPEG;
  }

}
