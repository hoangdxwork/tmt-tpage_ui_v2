import { Observable, Observer, of } from "rxjs";
import { tap } from "rxjs/operators";
import { CachedImageDTO } from "../../dto/image/image.dto";

export class ImageFacade {
  private _cachedImages: any = {};

  constructor() { }

  set cachedImages(image: CachedImageDTO) {
      this._cachedImages[image.url] = image.data;
  }

  getImage(url: string): Observable<any> {
    if (this._cachedImages[url]) {
        return of(this._cachedImages[url]);
    }

    return this.getBase64ImageFromURL(url).pipe(
        tap(res => this.checkAndCacheImage(url, res))
    );
  }

  checkAndCacheImage(url: string, data: string) {
      if (!this._cachedImages[url]) {
          this._cachedImages[url] = data;
      }
  }

  getBase64ImageFromURL(url: string): Observable<any> {
      return Observable.create((observer: Observer<string>) => {
          // create an image object
          let img = new Image();
          img.crossOrigin = 'Anonymous';
          img.src = url;
          if (!img.complete) {
              // This will call another method that will create image from url
              img.onload = () => {
                  observer.next(this.getBase64Image(img));
                  observer.complete();
              };
              img.onerror = (err) => {
                  observer.error(err);
              };
          } else {
              observer.next(this.getBase64Image(img));
              observer.complete();
          }
      });
  }

  getBase64Image(img: HTMLImageElement) {
      // We create a HTML canvas object that will create a 2d image
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      // This will draw image
      ctx?.drawImage(img, 0, 0);
      // Convert the drawn image to Data URL
      var dataURL = canvas.toDataURL("image/png");
      return dataURL;
  }

}
