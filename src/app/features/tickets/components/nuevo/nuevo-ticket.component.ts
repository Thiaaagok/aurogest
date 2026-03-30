import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { TicketsService } from '../../services/tickets.service';
import { CreateTicketDto } from '../../models/ticket.model';
import { TICKET_PRIORIDADES, TICKET_MODULOS } from '../../models/ticket.enums';
import {
  FileUploaderComponent,
  FileUploaderConfig,
} from '../../../common/components/file-uploader/file-uploader.component';
import { v4 as uuid } from 'uuid';
import { AlertasService } from '../../../common/services/alertas.service';
import { Config } from '../../../common/config/config';

@Component({
  selector: 'app-nuevo-ticket',
  standalone: true,
  imports: [
    PrimeNgModule,
    CommonModule,
    CustomMaterialModule,
    FormsModule,
    FloatLabel,
    TextareaModule,
    InputTextModule,
    FileUploaderComponent,
  ],
  templateUrl: './nuevo-ticket.component.html',
  styleUrl: './nuevo-ticket.component.scss',
})
export class NuevoTicketComponent {
  private alertasService = inject(AlertasService);

  nuevoTicket: CreateTicketDto = {
    Id: uuid(),
    Titulo: '',
    Descripcion: '',
    Prioridad: 'MEDIA',
    Modulo: 'OTRO',
  };

  archivosAdjuntos: string[] = [];

  uploaderConfig: FileUploaderConfig = {
    apiUrl: `${Config.APIURL}/tickets`,
    uploadPath: '/upload',

    filesBaseUrl: `${Config.APIURL}/uploads/tickets`,

    fieldName: 'archivos', 
    responseKey: 'archivos',

    accept: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/webm',
    ],

    title: 'Archivos del ticket',
  };
  cargando = false;

  prioridadesOpciones = TICKET_PRIORIDADES;
  modulosOpciones = TICKET_MODULOS;

  private ref = inject(DynamicDialogRef);
  private ticketsService = inject(TicketsService);

  onArchivosAdjuntosChange(archivos: string[]) {
    this.archivosAdjuntos = archivos;
  }

  onErrorUploader(error: string) {
    console.error('Error uploader:', error);
    this.alertasService.errorAlerta('Error', error);
  }

  onSubmit() {
    this.cargando = true;
    this.nuevoTicket.Archivos = this.archivosAdjuntos;
    this.ticketsService.crear(this.nuevoTicket).subscribe({
      next: () => {
        this.cargando = false;
        this.ref.close(true);
      },
      error: (err) => {
        this.cargando = false;
        console.error(err);
      },
    });
  }

  cerrar() {
    this.ref.close();
  }
}
