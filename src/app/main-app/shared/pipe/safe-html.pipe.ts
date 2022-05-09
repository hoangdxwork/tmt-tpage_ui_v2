import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { TDSHelperString } from 'tmt-tang-ui';

@Pipe({ name: 'safeHtml' })

export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) { }

    transform(value: string): any {
      if(TDSHelperString.hasValueString(value)) {
        return this.sanitized.bypassSecurityTrustHtml(value);
      }
    }
}
