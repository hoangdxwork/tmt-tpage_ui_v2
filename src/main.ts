import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { getSignalR } from './app/main-app/services/signalR/client-signalR';
import { BaseHelper } from './app/main-app/shared/helper/base.helper';
import { environment } from './environments/environment';

(window as any).global = window;

const providers = [
  { provide: 'BASE_URL', useFactory: BaseHelper.getBaseUrl(), deps: [] },
  { provide: 'BASE_API', useValue: BaseHelper.getBaseApi() },
  { provide: 'BASE_SIGNALR', useValue: getSignalR() }
];

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic(providers).bootstrapModule(AppModule, {
    preserveWhitespaces: true
  })
  .catch(err => console.log(err));
});
