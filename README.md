# Source

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.16.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Clone source
### Nếu angular 12 ( update angular 12 -> 13 )

 ng update @angular/core@13 @angular/cli@13 --allow-dirty --force
 npm i @angular/cdk@13.3.9 
 npm i https://tang-ui.tpos.dev/lib/tds-report-2.0.0.tgz
 npm i rxjs@7.5.5
 ng build --prod 
### Nếu angular 13

 npm i --force
 npm i https://tang-ui.tpos.dev/lib/tds-report-2.0.0.tgz
 ng build --prod 
Ghi chú: rxjs@7.5.5 -> destroy$ = new Subject<void>();
Yêu cầu: nodejs > v.12, typescript > v4.4

Run production-test: ng s --configuration production
Run build deloy: npm run build:test