import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
  selector: '[icon-emoji-mart]',
  templateUrl: 'icon-emoji-mart.component.html',
  styles: [
    `
    .emoji-mart-scroll {
      border-bottom: 0;
      margin-bottom: 6px;
    }

    .emoji-mart-scroll + .emoji-mart-bar {
      display: none;
    }
    `
  ]
})

export class IconEmojiMartComponent implements OnInit {
  @Input() darkMode: boolean = false;
  @Input() perLine: number = 9;
  @Input() emojiSize: number = 24;
  @Input() sheetSize: 16|20|32|64 = 64;
  @Input() emojiTooltip:boolean = false;
  @Output() loadEmojiMart = new EventEmitter<any>();

  i18n={
    search: 'Tìm kiếm',
    notfound: 'Không tìm thấy icon',
    categories: {
      search: 'Kết quả tìm kiếm',
      recent: 'Đã dùng gần đây',
      people: 'Mặt cười & hình người',
      nature: 'Động vật & thiên nhiên',
      foods: 'Ẩm thực',
      activity: 'Hoạt động',
      places: 'Du lịch & địa điểm',
      objects: 'Đồ vật',
      symbols: 'Biểu tượng'
  }}
  themes = [
    'native',
    'apple',
    'google',
    'twitter',
    'facebook',
  ];

  set:any = '';
  native = true;
  excludeIcon=["flags"];

  ngOnInit(): void {
  }

  setTheme(set: string) {
    this.native = set === 'native';
    this.set = set;
  }

  handleClick($event: EmojiEvent) {
    if($event) {
      this.loadEmojiMart.emit($event);
    }
  }

  emojiFilter(e: string): boolean {
    // Can use this to test [emojisToShowFilter]
    if (e && e.indexOf && e.indexOf('1F4') >= 0) {
      return true;
    }
    return false;
  }
}

