import { Optional, Pipe, PipeTransform } from "@angular/core";
import { TDSHelperString } from "tds-ui/shared/utility";

@Pipe({
  name: 'bbcodeConvert'
})

export class BBcodeConvertPipe implements PipeTransform {

  constructor(){}

  transform(code: string) : any {
    const r = (f: (code: string) => string) => {
        code = this.run(f, code) as any;
    }

    if(TDSHelperString.hasValueString(code)) {
        r(this.img)
        r(this.size)
        r(this.font)
        r(this.color)
        r(this.i)
        r(this.b)
        r(this.url)
        r(this.html)
    }

    return code;
  }

  run(f: (code: string) => string, code: string) {
    for (;;) {
      const res = f(code)
      if (res === code) {
        return code
      }
      code = res
    }
  }

  img(code: string) {
    return code
      .replace(/\[img]/g, `<img src="`)
      .replace(/\[img=.*?]/g, `<img src="`)
      .replace(/\[\/img]/g, `">`)
  }

  i(code: string) {
    return code
      .replace(/\[i]/g, `<i>`)
      .replace(/\[i\=s]/g, `<i>`)
      .replace(/\[\/i]/g, `</i>`)
  }

  b(code: string) {
    return code
      .replace(/\[b]/g, `<b>`)
      .replace(/\[b\=s]/g, `<b>`)
      .replace(/\[\/b]/g, `</b>`)
  }

  attr(o: {
    start: string
    end: string
    f: (attr: string, body: string) => string
  }) {
    return function (code: string) {
      let start = code.indexOf(o.start)
      if (start === -1) {
        return code
      }

      let end = code.indexOf(']', start)
      if (end === -1) {
        return code
      }

      const attr = code.substring(start + o.start.length, end)
      const prefix = code.substring(0, start)

      start = end + 1
      if (start >= code.length) {
        return code
      }

      end = code.indexOf(o.end, start)
      if (end === -1) {
        return code
      }

      const body = code.substring(start, end)
      const suffix = code.substring(end + o.end.length)
      const span = o.f(attr, body)

      return prefix + span + suffix
    }
  }

  size = this.attr({
    start: '[size=',
    end: '[/size]',
    f: (attr, body) => `<span style="font-size: ${attr}">${body}</span>`,
  })

  font = this.attr({
    start: '[font=',
    end: '[/font]',
    f: (attr, body) => {
      attr = attr.replace(', &quot;', '')
      return `<span style="font-family: ${attr}">${body}</span>`
    },
  })

  url = this.attr({
    start: '[url=',
    end: '[/url]',
    f: (attr, body) => `<a href="${attr}">${body}</a>`,
  })

  color = this.attr({
    start: '[color=',
    end: '[/color]',
    f: (attr, body) => {
      if (attr.length === 5 && attr[0] === '#' && attr[4] === '0') {
        attr = attr.substring(0, 4) // make transparent text visible
      }
      return `<span style="color: ${attr}">${body}</span>`
    },
  })

  html = this.attr({
    start: '[format',
    end: '[end_format]',
    f: (attr, body) => {

      let value =  attr.indexOf('value');
      if(value > 0) {
          attr = attr.substring(0, value).trim();
      }

      attr = attr
          .replace(/type=/g, '')
          .replace(/'/g, '');

      return `<span class="${attr} text-info-500 font-semibold">${body}</span>`;
    },
  })


}


