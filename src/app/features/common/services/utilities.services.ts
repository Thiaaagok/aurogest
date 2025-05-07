import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UtilitiesService {
    
    private tituloSubject = new BehaviorSubject<string>('');
    public tituloActual$ = this.tituloSubject.asObservable();
 
   public setTituloPagina(nuevoTitulo: string) {
     this.tituloSubject.next(nuevoTitulo);
   } 

}