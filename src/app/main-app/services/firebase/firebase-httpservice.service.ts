import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TAuthService } from "@core/services";
import { catchError, EMPTY, Observable, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class FireBaseHttpService {

  private options: any;

  constructor(private http: HttpClient,
      private auth: TAuthService) {

      this.options = {};
      this.options.headers = new HttpHeaders();
      this.options.headers = this.options.headers.append('Content-Type', 'application/json');
      this.options.headers = this.options.headers.append('Access-Control-Allow-Origin', '*');
  }

  public request(method: string, url: string, options?: any): Observable<any> {
    options = this.prepareOption(options);

    return this.http.request(method, url, options || {})
        .pipe(catchError(error => {
            if (error.status == 401) {
                this.catchAuthError(error);
                return EMPTY;
            } else {
                return throwError(error);
            }
        }));
  }

  public get(url: string, options?: any): Observable<any> {
    options = this.prepareOption(options);

    return this.http.get(url, options)
        .pipe(catchError(error => {
            if (error.status == 401) {
                this.catchAuthError(error);
                return EMPTY;
            } else {
                return throwError(error);
            }
        }));
  }

  public post(url: string, body: any, options?: any): Observable<any> {
    options = this.prepareOption(options);

    return this.http.post(url, body, options)
        .pipe(catchError(error => {
            if (error.status == 401) {
                this.catchAuthError(error);
                return EMPTY;
            } else {
                return throwError(error);
            }
        }));
  }

  public put(url: string, body: any, options?: any): Observable<any> {
    options = this.prepareOption(options);

    return this.http.put(url, body, options)
        .pipe(catchError(error => {
            if (error.status == 401) {
                this.catchAuthError(error);
                return EMPTY;
            } else {
                return throwError(error);
            }
        }));
  }

  public delete(url: string, options?: any): Observable<any> {
    options = this.prepareOption(options);

    return this.http.delete(url, options)
        .pipe(catchError(error => {
            if (error.status == 401) {
                this.catchAuthError(error);
                return EMPTY;
            } else {
                return throwError(error);
            }
        }));
  }

  private catchAuthError(self: any) {
    return (res: Response) => {
        console.log(res);
        if (res.status === 401 || res.status === 403) {
            console.log(res);
        }

        return throwError(res);
    };
  }

  private prepareOption(options: any) {
    let token = this.auth.getAccessToken();

    options = options || this.options;
    options.headers = options.headers || this.options.headers || new HttpHeaders();
    options.headers = options.headers.set('Authorization', `Bearer ${token.access_token}`);

    return options;
  }

}
