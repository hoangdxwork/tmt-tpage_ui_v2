import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ConfigDataFacade {
    public onLoading$: EventEmitter<boolean> = new EventEmitter<boolean>();
}