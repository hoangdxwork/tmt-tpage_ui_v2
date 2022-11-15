import { GetAllFacebookPostDTO } from './../../../../dto/live-campaign/getall-facebook-post.dto';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-list-post',
  templateUrl: './modal-list-post.component.html'
})
export class ModalListPostComponent implements OnInit {

  @Input() facebookPosts!: GetAllFacebookPostDTO[];

  constructor() { }

  ngOnInit(): void {
  }

}
