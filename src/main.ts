import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import {BrowserModule,bootstrapApplication,provideProtractorTestingSupport} from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import routeConfig from './app/routes';
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideHttpClient(),
    provideProtractorTestingSupport(),
    provideRouter(routeConfig),
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
