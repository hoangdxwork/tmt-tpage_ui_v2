import { AfterViewInit, ElementRef, Directive, Input } from '@angular/core';

@Directive({
  selector: '[yuriAvatar]'
})

export class YuriAvatarDirective implements AfterViewInit {

  @Input() public src!: string;
  @Input() public avatar!: string;
  @Input() public width!: number;

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    this.transform();
  }

  letterAvatar(name: any, size: any): any {
    name = name || '';
    size = size || 60;

    var colours = [
      "#f44336", "#e91e63", "#ff80ab", "#f50057", "#c51162", "#9c27b0", "#ab47bc", "#9c27b0", "#6a1b9a", "#4a148c",
      "#ea80fc", "#e040fb", "#d500f9", "#7e57c2", "#673ab7", "#f39c12", "#651fff", "#3d5afe", "#bdc3c7", "#00838f"
    ];

    var nameSplit = String(name).toUpperCase().split(' ');
    var initials, charIndex, colourIndex, canvas, context, dataURI;


    if (nameSplit.length == 1) {
      initials = nameSplit[0] ? nameSplit[0].charAt(0) : '?';
    } else {
      initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
    }

    if (window.devicePixelRatio) {
      size = (size * window.devicePixelRatio);
    }

    charIndex = (initials == '?' ? 72 : initials.charCodeAt(0)) - 64;
    colourIndex = charIndex % 20;
    canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    context = canvas.getContext("2d") as any;

    context.fillStyle = colours[colourIndex - 1];
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = Math.round(canvas.width / 2) + "px Arial";
    context.textAlign = "center";
    context.fillStyle = "#FFF";
    context.fillText(initials, size / 2, size / 1.5);

    dataURI = canvas.toDataURL();
    canvas = null;

    return dataURI;
  }

  transform(): void {
    var name = this.avatar;
    if (!this.src) {
      this.el.nativeElement.src = this.letterAvatar(name, this.width);
      this.el.nativeElement.removeAttribute('avatar');
      this.el.nativeElement.setAttribute('alt', name);
    }
  };
}
