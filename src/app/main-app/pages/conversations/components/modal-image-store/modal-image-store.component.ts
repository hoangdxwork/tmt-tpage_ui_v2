import { Component, OnInit } from '@angular/core';
import { TDSModalRef } from 'tmt-tang-ui';

@Component({
  selector: 'app-modal-image-store',
  templateUrl: './modal-image-store.component.html',
  styleUrls: ['./modal-image-store.component.scss']
})
export class ModalImageStoreComponent implements OnInit {
  inputValue?: string; 

  listImage=[
    {
      id: '1',
      image:'/assets/images/conversation/imageAll-1.svg',
      choose: false,
    },
    {
      id: '2',
      image:'/assets/images/conversation/imageAll-2.svg',
      choose: true,
    },
    {
      id: '3',
      image:'/assets/images/conversation/imageAll-3.svg',
      choose: false,
    },
    {
      id: '4',
      image:'/assets/images/conversation/imageAll-4.svg',
      choose: false,
    },
    {
      id: '5',
      image:'/assets/images/conversation/imageAll-1.svg',
      choose: false,
    },
    {
      id: '6',
      image:'/assets/images/conversation/imageAll-2.svg',
      choose: false,
    },
    {
      id: '7',
      image:'/assets/images/conversation/imageAll-3.svg',
      choose: false,
    },
    {
      id: '8',
      image:'/assets/images/conversation/imageAll-4.svg',
      choose: false,
    },
    {
      id: '5',
      image:'/assets/images/conversation/imageAll-1.svg',
      choose: false,
    },
    {
      id: '6',
      image:'/assets/images/conversation/imageAll-2.svg',
      choose: false,
    },
    {
      id: '7',
      image:'/assets/images/conversation/imageAll-3.svg',
      choose: false,
    },
    {
      id: '8',
      image:'/assets/images/conversation/imageAll-4.svg',
      choose: false,
    },

  ] 

  listCollect = [
    {
      id:'1',
      image1: '/assets/images/conversation/imageCollection-1.svg',
      image2: '/assets/images/conversation/imageCollection-2.svg',
      image3: '/assets/images/conversation/imageCollection-3.svg',
      soLuong: 12,
      name:'Bộ sưu tập thời trang thu đông',
      choose: true,
    },
    {
      id:'2',
      image1: '/assets/images/conversation/imageCollection-7.svg',
      image2: '/assets/images/conversation/imageCollection-8.svg',
      image3: '/assets/images/conversation/imageCollection-9.svg',
      soLuong: 12,
      name:'Bộ sưu tập thời trang thu đông',
      choose: false,
    },
    {
      id:'3',
      image1: '/assets/images/conversation/imageCollection-4.svg',
      image2: '/assets/images/conversation/imageCollection-5.svg',
      image3: '/assets/images/conversation/imageCollection-6.svg',
      soLuong: 12,
      name:'Bộ sưu tập thời trang thu đông',
      choose: false,
    },
    {
      id:'4',
      image1: '/assets/images/conversation/imageCollection-1.svg',
      image2: '/assets/images/conversation/imageCollection-2.svg',
      image3: '/assets/images/conversation/imageCollection-3.svg',
      soLuong: 12,
      name:'Bộ sưu tập thời trang thu đông',
      choose: false,
    },
    {
      id:'5',
      image1: '/assets/images/conversation/imageCollection-4.svg',
      image2: '/assets/images/conversation/imageCollection-5.svg',
      image3: '/assets/images/conversation/imageCollection-6.svg',
      soLuong: 12,
      name:'Bộ sưu tập thời trang thu đông',
      choose: false,
    },
    {
      id:'6',
      image1: '/assets/images/conversation/imageCollection-7.svg',
      image2: '/assets/images/conversation/imageCollection-8.svg',
      image3: '/assets/images/conversation/imageCollection-9.svg',
      soLuong: 12,
      name:'Bộ sưu tập thời trang thu đông',
      choose: false,
    },
    {
      id:'7',
      image1: '/assets/images/conversation/imageCollection-7.svg',
      image2: '/assets/images/conversation/imageCollection-8.svg',
      image3: '/assets/images/conversation/imageCollection-9.svg',
      soLuong: 12,
      name:'Bộ sưu tập thời trang thu đông',
      choose: false,
    },
    {
      id:'8',
      image1: '/assets/images/conversation/imageCollection-4.svg',
      image2: '/assets/images/conversation/imageCollection-5.svg',
      image3: '/assets/images/conversation/imageCollection-6.svg',
      soLuong: 12,
      name:'Bộ sưu tập thời trang thu đông',
      choose: false,
    },
    {
      id:'9',
      image1: '/assets/images/conversation/imageCollection-1.svg',
      image2: '/assets/images/conversation/imageCollection-2.svg',
      image3: '/assets/images/conversation/imageCollection-3.svg',
      soLuong: 12,
      name:'Bộ sưu tập thời trang thu đông',
      choose: false,
    },
  ]



  constructor(
    private modal: TDSModalRef,
  ) { }

  ngOnInit(): void {
  }

cancel() {
  this.modal.destroy(null);
}
}
