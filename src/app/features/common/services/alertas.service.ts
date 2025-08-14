import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor() { }

  confirmacionAlerta(titulo: string, texto: string) {
    return Swal.fire({
      title: titulo,
      text: texto,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar"
    });
  }

  errorAlerta(titulo: string, texto: string) {
    Swal.fire({
      icon: "error",
      title: titulo,
      text: texto,
      footer: '<a href="tickets">Escribir un ticket?</a>'
    });
  }

  advertenciaAlerta(titulo: string, texto: string) {
    Swal.fire({
      icon: "warning",
      title: titulo,
      text: texto,
    });
  }

}
