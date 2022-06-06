import * as signalR from "@microsoft/signalr";
import { HttpRequest, HttpResponse } from '@microsoft/signalr';
import { TAuthService } from "src/app/lib";

export function getSignalR() {
  if (document.getElementsByTagName('signalr').length > 0) {
      return (document.getElementsByTagName('signalr')[0].attributes as any)['href'].value;
  } else {
      return '';
  }
}

// As per @Brennan's answer I used his advice and extened the default one
export class SignalRHttpClient extends signalR.DefaultHttpClient {

    constructor(public auth: TAuthService) {
        super(console); // the base class wants an signalR.ILogger, I'm not sure if you're supposed to put *the console* into it, but I did and it seemed to work
    }

    // So far I have only overriden this method, and all seems to work well
    public async send(request: HttpRequest): Promise<HttpResponse> {
        var authHeaders = this.getAuthHeaders(); // These are the extra headers I needed to put in
        request.headers = { ...request.headers, ...authHeaders };
        // Now we have manipulated the request how we want we can just call the base class method
        return super.send(request);
    }

    private getAuthHeaders(): any {
      let token =  this.auth.getAccessToken()?.access_token;
      if(token) {
          { Authorization: `Bearer ${token}`};
      } else {
        return ({});
      }
    }

}
