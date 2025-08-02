import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UtilitiesService {

  private tituloSubject = new BehaviorSubject<string>('');
  public tituloActual$ = this.tituloSubject.asObservable();

  public setTituloPagina(nuevoTitulo: string) {
    this.tituloSubject.next(nuevoTitulo);
  }

  private loginSubject = new BehaviorSubject<boolean>(false);
  public login$ = this.loginSubject.asObservable();

  public setearLogin(login: boolean){
    this.loginSubject.next(login);
  }
}