import { Injectable } from '@angular/core';
import { inputToRGB, rgbToHex, rgbToHsv, toNumber} from 'tmt-tang-ui';
interface HsvObject {
  h: number;
  s: number;
  v: number;
}

interface RgbObject {
  r: number;
  g: number;
  b: number;
}
interface Opts {
  theme?: 'dark' | 'default';
  backgroundColor?: string;
}
@Injectable()
export class HelperColorService {
  private _hueStep = 2;
  private _saturationStep = 0.16;
  private _saturationStep2 = 0.05;
  private _brightnessStep1 = 0.05;
  private _brightnessStep2 = 0.15;
  private _lightColorCount = 5;
  private _darkColorCount = 4;
  private darkColorMap = [
    { index: 7, opacity: 0.15 },
    { index: 6, opacity: 0.25 },
    { index: 5, opacity: 0.3 },
    { index: 5, opacity: 0.45 },
    { index: 5, opacity: 0.65 },
    { index: 5, opacity: 0.85 },
    { index: 4, opacity: 0.9 },
    { index: 3, opacity: 0.95 },
    { index: 2, opacity: 0.97 },
    { index: 1, opacity: 0.98 },
  ];
  constructor() { }
  get hueStep() {
    return this._hueStep;
  }
  set hueStep(hueStep: number) {
    this._hueStep = toNumber(hueStep) ;
  }

  get saturationStep() {
    return this._saturationStep;
  }
  set saturationStep(saturationStep: number) {
    this._saturationStep = toNumber(saturationStep);
  }

  get saturationStep2() {
    return this._saturationStep2;
  }
  set saturationStep2(saturationStep2: number) {
    this._saturationStep2 = toNumber(saturationStep2) ;
  }

  get brightnessStep1() {
    return this._brightnessStep1;
  }
  set brightnessStep1(brightnessStep1: number) {
    this._brightnessStep1 = toNumber(brightnessStep1);
  }


  get brightnessStep2() {
    return this._brightnessStep2;
  }
  set brightnessStep2(brightnessStep2: number) {
    this._brightnessStep2 = toNumber(brightnessStep2);
  }


  get lightColorCount() {
    return this._lightColorCount;
  }
  set lightColorCount(lightColorCount: number) {
    this._lightColorCount = lightColorCount;
  }
  get darkColorCount() {
    return this._darkColorCount;
  }
  set darkColorCount(darkColorCount: number) {
    this._darkColorCount = darkColorCount;
  }
  // Wrapper function ported from TinyColor.prototype.toHsv
  // Keep it here because of `hsv.h * 360`
  private toHsv({ r, g, b }: RgbObject): HsvObject {
    const hsv = rgbToHsv(r, g, b);
    return { h: hsv.h * 360, s: hsv.s, v: hsv.v };
  }

  // Wrapper function ported from TinyColor.prototype.toHexString
  // Keep it here because of the prefix `#`
  private toHex({ r, g, b }: RgbObject): string {
    return `#${rgbToHex(r, g, b, false)}`;
  }
  private mix(rgb1: RgbObject, rgb2: RgbObject, amount: number): RgbObject {
    const p = amount / 100;
    const rgb = {
      r: (rgb2.r - rgb1.r) * p + rgb1.r,
      g: (rgb2.g - rgb1.g) * p + rgb1.g,
      b: (rgb2.b - rgb1.b) * p + rgb1.b,
    };
    return rgb;
  }
 private getHue(hsv: HsvObject, i: number, light?: boolean): number {
    let hue: number;
   
    if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
      hue = light ? Math.round(hsv.h) - this.hueStep * i : Math.round(hsv.h) + this.hueStep * i;
    } else {
      hue = light ? Math.round(hsv.h) + this.hueStep * i : Math.round(hsv.h) - this.hueStep * i;
    }
    if (hue < 0) {
      hue += 360;
    } else if (hue >= 360) {
      hue -= 360;
    }
    return hue;
  }
  private getSaturation(hsv: HsvObject, i: number, light?: boolean): number {
    // grey color don't change saturation
    if (hsv.h === 0 && hsv.s === 0) {
      return hsv.s;
    }
    let saturation: number;
    if (light) {
      saturation = hsv.s - this.saturationStep * i;
    } else if (i === this.darkColorCount) {
      saturation = hsv.s + this.saturationStep;
    } else {
      saturation = hsv.s + this.saturationStep2 * i;
    }
 
    if (saturation > 1) {
      saturation = 1;
    }
    if (light && i === this.lightColorCount && saturation > 0.1) {
      saturation = 0.1;
    }
    if (saturation < 0.06) {
      saturation = 0.06;
    }
    return Number(saturation.toFixed(2));
  }
  private getValue(hsv: HsvObject, i: number, light?: boolean): number {
    let value: number;
    if (light) {
      value = hsv.v + this.brightnessStep1 * i;
    } else {
      value = hsv.v - this.brightnessStep2 * i;
    }
    if (value > 1) {
      value = 1;
    }
    return Number(value.toFixed(2));
  }
  generate(color: string, opts: Opts = {}): string[] {
    const patterns: Array<string> = [];
    const pColor = inputToRGB(color);
    for (let i = this.lightColorCount; i > 0; i -= 1) {
      const hsv = this.toHsv(pColor);
      const colorString: string = this.toHex(
        inputToRGB({
          h: this.getHue(hsv, i, true),
          s: this.getSaturation(hsv, i, true),
          v: this.getValue(hsv, i, true),
        }),
      );
      patterns.push(colorString);
    }
    patterns.push(this.toHex(pColor));
    for (let i = 1; i <= this.darkColorCount; i += 1) {
      const hsv = this.toHsv(pColor);
      const colorString: string = this.toHex(
        inputToRGB({
          h: this.getHue(hsv, i),
          s: this.getSaturation(hsv, i),
          v: this.getValue(hsv, i),
        }),
      );
      patterns.push(colorString);
    }
  
    // dark theme patterns
    if (opts.theme === 'dark') {
      return this.darkColorMap.map(({ index, opacity }) => {
        const darkColorString: string = this.toHex(
          this.mix(inputToRGB(opts.backgroundColor || '#141414'), inputToRGB(patterns[index]), opacity * 100),
        );
        return darkColorString;
      });
    }
    return patterns;
  }
}


