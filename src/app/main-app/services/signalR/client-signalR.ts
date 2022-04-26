import * as signalR from "@microsoft/signalr";
import { HttpRequest, HttpResponse } from '@microsoft/signalr';
import { TAuthService } from "src/app/lib";

// As per @Brennan's answer I used his advice and extened the default one
export class SignalRHttpClient extends signalR.DefaultHttpClient {

    public _keyCache: string = "accessToken";
    // token: string = "zEgoyxN_SxVYsWlm8785xmwXRZihp6kVzoc3eOmFBSIQFYSKtn3cwMDKxh8kM7xG6NTnO_ikuLcKH4P27RwHocnjlcWSSCQibK3knjMK_He2ZWmqDzA_qJMOqs6qyOMwIzfwO6w9yR7egVtEVcqXCsBcOtdqVI-ZwqbLn9WECvlkmE2gZUYp8HvA3JUGpA9s2X9A9nnNVTOpcVH-zzt0cxw0ZisbWyDQguQFCz4tuhwzKGVMgYepfRGZVQehs2VnuIybUdpE4GevI2i8FYZjjjvqnNmIugRL5QsI9TA8DcVBMD-C2pmLqr0yb4_t09jI-P73McNV90G1XlJFpooPldH6ZX2zPZfrxfQO3nm3lvsWo7U_0Oxxytq_CG5nUOdQPfrRWEdYCFFgIV4PMDEWX8dZY203c2IwDfsWX3cvAkjLARbPcXjiTbYy_iIse1y9o3Aze84CB4tWFevqsQxjiHlHuMwyeZd8sFZxDt1fxkD6363u";
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

    private getAuthHeaders(): any{
      let token =  this.auth.getAccessToken()?.access_token;
      if(token) {
          { Authorization: `Bearer ${token}`};
      } else {
        return ({});
      }
    }

}
