import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild, ElementRef } from '@angular/core';
import { EmojiSearch } from '@ctrl/ngx-emoji-mart';

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

  @Output() loadEmojiMart = new EventEmitter<any>();
  customEmojis = [
    {
      id: 'octocat',
      name: 'Octocat',
      colons: ':octocat:',
      keywords: ['github'],
      emoticons: [] as any,
      imageUrl: 'https://assets-cdn.github.com/images/icons/emoji/octocat.png?v7'
    }
  ]

  obj = {
    id: 'octocat',
    name: 'Octocat',
    colons: ':octocat',
    text: '',
    emoticons: [] as any,
    custom: true,
    imageUrl: 'https://github.githubassets.com/images/icons/emoji/octocat.png'
  }

  excludeIcon=["flags"];

  searchText: string = '';
  currentSort: string = 'count';
  objQuickReply: Object = {};

  sortOptions: any[] = [
      { value: 'count', text: 'Sử dụng nhiều nhất' },
      { value: 'recent', text: 'Sử dụng gần nhất' }
  ];

  constructor(private emojiSearch: EmojiSearch) {
  }

  ngOnInit() {
  }

  addEmoji(event: any){
     this.loadEmojiMart.emit(event);
  }
  emojiFallback = (emoji: any, props: any) =>
  emoji ? `:${emoji.shortNames[0]}:` : props.emoji;
}

