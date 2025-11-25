import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideNzI18n, hu_HU } from 'ng-zorro-antd/i18n';
import { NZ_DATE_CONFIG } from 'ng-zorro-antd/i18n';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    BrowserAnimationsModule,
    provideHttpClient(),
    provideNzI18n(hu_HU),
    {
      provide: NZ_DATE_CONFIG,
      useValue: {
        firstDayOfWeek: 1  // 1 = Monday
      }
    }
  ]
}).catch(err => console.error(err));
