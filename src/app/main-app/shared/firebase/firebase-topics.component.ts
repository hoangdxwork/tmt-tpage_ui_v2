import { Component, OnInit, ViewContainerRef, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { FirebaseRegisterService } from '@app/services/firebase/firebase-register.service';
import { FireBaseTopicDto } from '@app/dto/firebase/topics.dto';
import { FirebasePushNotificationService } from '@app/services/firebase/firebase-notify.service';

@Component({
  selector: 'firebase-topics',
  templateUrl: './firebase-topics.component.html',
  styles: [
    ` :host {
        width: 100%;
        height: 100%;
      }
    `
  ]
})

export class FirebaseTopicsComponent implements OnInit {

  data: FireBaseTopicDto[] = [{"group":"Khách hàng","topics":[{"id":"Partner:Created","name":"Thêm mới"},{"id":"Partner:Updated","name":"Cập nhật"},{"id":"Partner:Deleted","name":"Xóa"}]},{"group":"Đơn hàng","topics":[{"id":"SaleOnlineOrder:Created","name":"Thêm mới"},{"id":"SaleOnlineOrder:Updated","name":"Cập nhật"},{"id":"SaleOnlineOrder:Deleted","name":"Xóa"}]},{"group":"Hóa đơn","topics":[{"id":"FastSaleOrder:Created","name":"Thêm mới"},{"id":"FastSaleOrder:Updated","name":"Cập nhật thông tin"},{"id":"FastSaleOrder:Canceled","name":"Hủy"},{"id":"FastSaleOrder:Deleted","name":"Xóa"}]},{"group":"Giao hàng","topics":[{"id":"FastSaleOrder:Shipping","name":"Thay đổi trạng thái"}]},{"group":"Hội thoại","topics":[{"id":"Conversation:AssignedToMe","name":"Hội thoại được gán cho tôi"}]},{"group":"Giỏ hàng","topics":[{"id":"ShoppingCart:Created","name":"Thêm mới"},{"id":"ShoppingCart:Updated","name":"Cập nhật"},{"id":"ShoppingCart:Canceled","name":"Hủy"}]},{"group":"Hệ thống","topics":[{"id":"System:Locked","name":"Báo khóa"},{"id":"System:Expired","name":"Hết hạn"},{"id":"System:News","name":"Khuyến mãi & cập nhật"}]}];
  ids: any[] = [];

  constructor(private message: TDSMessageService,
    private firebasePushNotificationService: FirebasePushNotificationService,
    private firebaseRegisterService: FirebaseRegisterService){
  }

  ngOnInit(){
    this.loadTopics();
  }

  loadTopics() {
    this.firebaseRegisterService.topics().subscribe();
  }

  registerDevice() {

  }

  registerTopics() {
    let model = {
      TopicIds: this.ids
    }

    this.firebaseRegisterService.registerTopics(model).subscribe({
      next: (res: any) => {
          this.message.success('Đăng kí nhận tin thành công');
      },
      error: (err: any) => {
          this.message.error(err?.error?.message);
      }
    })
  }

  onChecked(event: any, item: any) {
    if(event == true) {
        this.ids.push(item.id);
    } else {
        this.ids = this.ids.filter(x => x != item.id);
    }

    this.ids = [...this.ids];
    console.log(this.ids);
  }

  removeToken() {
    this.firebasePushNotificationService.deleteToken();
  }

  applyFirebase() {
    this.firebasePushNotificationService.requestPermission();
  }

}
