// file-uploader/file-uploader.component.ts
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

// ─────────────────────────────────────────────────────────────────────────────
// Interfaces públicas
// ─────────────────────────────────────────────────────────────────────────────

export interface FileUploaderConfig {
  /** URL base del endpoint (sin trailing slash). Ej: 'https://api.example.com/uploads' */
  apiUrl: string;

  /**
   * Segmento que se agrega al apiUrl para subir archivos.
   * Resultado: POST  {apiUrl}/{entityId}{uploadPath}
   * Default: '' (vacío → POST directo a {apiUrl}/{entityId})
   */
  uploadPath?: string;

  /**
   * Segmento para reordenar archivos.
   * Resultado: PATCH {apiUrl}/{entityId}{reorderPath}
   * Default: '/reorder'
   */
  reorderPath?: string;

  /**
   * Segmento para eliminar archivos.
   * Resultado: DELETE {apiUrl}/{entityId}{deletePath}/{fileName}
   * Default: '' (vacío → DELETE directo a {apiUrl}/{entityId}/{fileName})
   */
  deletePath?: string;

  /**
   * URL base donde se sirven los archivos ya subidos.
   * Ej: 'https://cdn.example.com/uploads/productos'
   * Si no se especifica, usa: {apiUrl}/uploads/{entityType}
   */
  filesBaseUrl?: string;

  /** MIME types aceptados. Default: imágenes comunes */
  accept?: string[];

  /** Tamaño máximo por archivo en bytes. Default: 5MB */
  maxFileSize?: number;

  /** Cantidad máxima de archivos. Default: 10 */
  maxFiles?: number;

  /** Nombre del campo en el FormData. Default: 'files' */
  fieldName?: string;

  /**
   * Cómo interpretar la respuesta del servidor.
   * - 'array'  → la respuesta ES un array de strings con los nombres
   * - 'object' → la respuesta es un objeto; indicar la clave con `responseKey`
   * Default: 'object'
   */
  responseType?: 'array' | 'object';

  /**
   * Clave del objeto respuesta que contiene el array de nombres de archivo.
   * Solo se usa si responseType === 'object'.
   * Default: 'imagenes'
   */
  responseKey?: string;

  /** Mostrar badge "Portada" en el primer elemento. Default: true */
  showPortadaBadge?: boolean;

  /** Permitir recorte (crop) de imágenes. Default: true */
  enableCrop?: boolean;

  /** Texto del título del componente. Default: 'Archivos' */
  title?: string;

  /** Texto del drop-zone. Default: 'Arrastrá tus archivos acá' */
  dropzoneText?: string;

  /** Hint del drop-zone. Se genera automáticamente si no se especifica */
  dropzoneHint?: string;
}

export interface FilePreview {
  id: string;
  file?: File;
  nombre?: string;
  url: string;
  tipo: 'imagen' | 'video' | 'audio' | 'documento' | 'otro';
  estado: 'pendiente' | 'subiendo' | 'subido' | 'error';
  progreso: number;
  error?: string;
  cropUrl?: string;
  cropCanvas?: HTMLCanvasElement;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers internos
// ─────────────────────────────────────────────────────────────────────────────

function detectarTipo(mimeOrExtension: string): FilePreview['tipo'] {
  const v = mimeOrExtension.toLowerCase();
  if (v.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|avif|svg)$/.test(v))
    return 'imagen';
  if (v.startsWith('video/') || /\.(mp4|webm|mov|avi|mkv)$/.test(v))
    return 'video';
  if (v.startsWith('audio/') || /\.(mp3|wav|ogg|flac|aac)$/.test(v))
    return 'audio';
  if (
    v.includes('pdf') ||
    v.includes('document') ||
    v.includes('sheet') ||
    v.includes('presentation') ||
    /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv)$/.test(v)
  )
    return 'documento';
  return 'otro';
}

const DEFAULT_CONFIG: Required<FileUploaderConfig> = {
  apiUrl: '',
  uploadPath: '',
  reorderPath: '/reorder',
  deletePath: '',
  filesBaseUrl: '',
  accept: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  maxFileSize: 5 * 1024 * 1024,
  maxFiles: 10,
  fieldName: 'files',
  responseType: 'object',
  responseKey: 'imagenes',
  showPortadaBadge: true,
  enableCrop: true,
  title: 'Archivos',
  dropzoneText: 'Arrastrá tus archivos acá',
  dropzoneHint: '',
};

// ─────────────────────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-file-uploader',
  imports: [CommonModule],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss',
})
export class FileUploaderComponent implements OnInit, OnChanges {
  // ── Inputs ────────────────────────────────────────────────────────────────

  /** ID de la entidad dueña de los archivos (producto, usuario, etc.) */
  @Input() entityId!: string;

  /**
   * Archivos ya guardados en el servidor (solo sus nombres).
   * Ej: ['foto1.jpg', 'foto2.jpg']
   */
  @Input() archivosIniciales: string[] = [];

  /**
   * Configuración del uploader. Todos los campos son opcionales;
   * se mezclan con los defaults.
   */
  @Input() config: FileUploaderConfig = { apiUrl: '' };

  // ── Outputs ───────────────────────────────────────────────────────────────

  /** Emite el array de nombres de archivo cada vez que cambia */
  @Output() archivosChange = new EventEmitter<string[]>();

  /** Emite cuando hay un error (subida, validación, etc.) */
  @Output() errorOcurrido = new EventEmitter<string>();

  // ── ViewChilds ────────────────────────────────────────────────────────────

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('cropCanvas') cropCanvasRef!: ElementRef<HTMLCanvasElement>;

  // ── Estado interno ────────────────────────────────────────────────────────

  archivos: FilePreview[] = [];
  dragging = false;
  subiendo = false;
  dragIndex = -1;
  dragOverIndex = -1;

  // Crop
  cropArchivo: FilePreview | null = null;
  cropRect = { x: 20, y: 20, w: 200, h: 200 };
  private cropImg = new Image();
  private cropDragging = false;
  private cropResizing = false;
  private resizeCorner = '';
  private dragStart = { x: 0, y: 0, rx: 0, ry: 0, rw: 0, rh: 0 };

  // Config resuelta (defaults + lo que mandó el usuario)
  cfg!: Required<FileUploaderConfig>;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.resolverConfig();
    this.cargarArchivosIniciales();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.resolverConfig();
    }
    if (changes['archivosIniciales']) {
      const nuevos: string[] = changes['archivosIniciales'].currentValue ?? [];
      const yaHayLocales = this.archivos.some((a) => a.estado !== 'subido');
      if (nuevos.length > 0 && !yaHayLocales) {
        this.cargarArchivosIniciales();
      }
    }
  }

  // ── Config ────────────────────────────────────────────────────────────────

  private resolverConfig(): void {
    this.cfg = { ...DEFAULT_CONFIG, ...this.config };

    // Generar hint automático si no se proveyó
    if (!this.cfg.dropzoneHint) {
      const exts = this.cfg.accept
        .map((m) => m.split('/')[1]?.toUpperCase() ?? m.toUpperCase())
        .join(', ');
      const mb = Math.round(this.cfg.maxFileSize / (1024 * 1024));
      this.cfg.dropzoneHint = `${exts} · Máx. ${mb} MB por archivo · Hasta ${this.cfg.maxFiles} archivos`;
    }
  }

  // ── Carga inicial ─────────────────────────────────────────────────────────

  private cargarArchivosIniciales(): void {
    this.archivos = (this.archivosIniciales ?? []).map((nombre) => ({
      id: crypto.randomUUID(),
      nombre,
      url: this.buildFileUrl(nombre),
      tipo: detectarTipo(nombre),
      estado: 'subido' as const,
      progreso: 100,
    }));
    this.cdr.detectChanges();
  }

  private buildFileUrl(nombre: string): string {
    const base = this.cfg.filesBaseUrl || `${this.cfg.apiUrl}/uploads`;
    return `${base}/${nombre}`;
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  get hayPendientes(): boolean {
    return this.archivos.some((a) => a.estado === 'pendiente');
  }

  get cantidadPendientes(): number {
    return this.archivos.filter((a) => a.estado === 'pendiente').length;
  }

  get aceptaImagenes(): boolean {
    return this.cfg.accept.some((m) => m.startsWith('image/'));
  }

  // ── Drag & drop zona ──────────────────────────────────────────────────────

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.dragging = true;
  }

  onDragLeave(): void {
    this.dragging = false;
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragging = false;
    const files = Array.from(e.dataTransfer?.files ?? []);
    this.agregarArchivos(files);
  }

  onFileSelect(e: Event): void {
    const files = Array.from((e.target as HTMLInputElement).files ?? []);
    this.agregarArchivos(files);
    (e.target as HTMLInputElement).value = '';
  }

  private agregarArchivos(files: File[]): void {
    const disponibles = this.cfg.maxFiles - this.archivos.length;
    const errores: string[] = [];

    files.slice(0, disponibles).forEach((file) => {
      if (!this.cfg.accept.includes(file.type)) {
        errores.push(`"${file.name}": tipo no permitido (${file.type})`);
        return;
      }
      if (file.size > this.cfg.maxFileSize) {
        const mb = (file.size / (1024 * 1024)).toFixed(1);
        errores.push(`"${file.name}": supera el límite (${mb} MB)`);
        return;
      }
      this.archivos.push({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        tipo: detectarTipo(file.type),
        estado: 'pendiente',
        progreso: 0,
      });
    });

    if (errores.length) {
      this.errorOcurrido.emit(errores.join('\n'));
    }
  }

  // ── Subir ─────────────────────────────────────────────────────────────────

  async subirTodas(): Promise<void> {
    const pendientes = this.archivos.filter((a) => a.estado === 'pendiente');
    this.subiendo = true;

    for (const archivo of pendientes) {
      await this.subirUno(archivo);
    }

    await this.sincronizarOrden();
    this.subiendo = false;
  }

  private subirUno(archivo: FilePreview): Promise<void> {
    return new Promise((resolve) => {
      archivo.estado = 'subiendo';
      archivo.progreso = 0;

      const formData = new FormData();
      const fileToUpload =
        archivo.cropUrl && archivo.file
          ? this.dataUrlToFile(archivo.cropUrl, archivo.file.name)
          : archivo.file!;

      formData.append(this.cfg.fieldName, fileToUpload);

      const uploadUrl = `${this.cfg.apiUrl}/${this.entityId}${this.cfg.uploadPath}`;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', uploadUrl);

      const token = localStorage.getItem('access_token');

      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          archivo.progreso = Math.round((e.loaded / e.total) * 100);
          this.cdr.detectChanges();
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          try {
            const resp = JSON.parse(xhr.responseText);
            let nombres: string[];

            if (this.cfg.responseType === 'array') {
              nombres = resp as string[];
            } else {
              nombres = resp[this.cfg.responseKey] as string[];
            }

            archivo.nombre = nombres[nombres.length - 1];
            archivo.estado = 'subido';
            archivo.url = this.buildFileUrl(archivo.nombre);
            archivo.progreso = 100;
            this.emitirCambio();
          } catch {
            archivo.estado = 'error';
            archivo.error = 'Respuesta inesperada del servidor';
          }
        } else {
          archivo.estado = 'error';
          archivo.error = `Error ${xhr.status}`;
        }
        this.cdr.detectChanges();
        resolve();
      };

      xhr.onerror = () => {
        archivo.estado = 'error';
        archivo.error = 'Sin conexión';
        this.cdr.detectChanges();
        resolve();
      };

      xhr.send(formData);
    });
  }

  // ── Emitir cambios ────────────────────────────────────────────────────────

  private emitirCambio(): void {
    const nombres = this.archivos.filter((a) => a.nombre).map((a) => a.nombre!);
    this.archivosChange.emit(nombres);
  }

  private async sincronizarOrden(): Promise<void> {
    const orden = this.archivos.filter((a) => a.nombre).map((a) => a.nombre!);
    if (!orden.length) return;
    const url = `${this.cfg.apiUrl}/${this.entityId}${this.cfg.reorderPath}`;
    this.http.patch(url, { orden }).subscribe();
  }

  // ── Establecer portada ────────────────────────────────────────────────────

  establecerPortada(idx: number): void {
    if (idx === 0) return;
    const arr = [...this.archivos];
    const [principal] = arr.splice(idx, 1);
    arr.unshift(principal);
    this.archivos = arr;
    this.emitirCambio();

    if (this.archivos.every((a) => a.estado === 'subido')) {
      this.sincronizarOrden();
    }
  }

  // ── Eliminar ──────────────────────────────────────────────────────────────

  eliminar(archivo: FilePreview, idx: number): void {
    if (archivo.estado === 'subido' && archivo.nombre) {
      const url = `${this.cfg.apiUrl}/${this.entityId}${this.cfg.deletePath}/${archivo.nombre}`;
      this.http.delete(url).subscribe();
    }
    if (archivo.url.startsWith('blob:')) {
      URL.revokeObjectURL(archivo.url);
    }
    this.archivos.splice(idx, 1);
    this.emitirCambio();
  }

  // ── Drag reorder ──────────────────────────────────────────────────────────

  onItemDragStart(i: number): void {
    this.dragIndex = i;
  }

  onItemDragEnter(i: number): void {
    this.dragOverIndex = i;
  }

  onItemDragEnd(): void {
    if (
      this.dragIndex !== -1 &&
      this.dragOverIndex !== -1 &&
      this.dragIndex !== this.dragOverIndex
    ) {
      const arr = [...this.archivos];
      const [moved] = arr.splice(this.dragIndex, 1);
      arr.splice(this.dragOverIndex, 0, moved);
      this.archivos = arr;
      this.emitirCambio();

      if (this.archivos.every((a) => a.estado === 'subido')) {
        this.sincronizarOrden();
      }
    }
    this.dragIndex = -1;
    this.dragOverIndex = -1;
  }

  // ── Crop (solo imágenes) ──────────────────────────────────────────────────

  abrirCrop(archivo: FilePreview): void {
    this.cropArchivo = archivo;
    setTimeout(() => this.initCropCanvas(archivo), 50);
  }

  private initCropCanvas(archivo: FilePreview): void {
    const canvas = this.cropCanvasRef?.nativeElement;
    if (!canvas) return;

    this.cropImg.onload = () => {
      const maxW = canvas.parentElement!.clientWidth;
      const scale = Math.min(1, maxW / this.cropImg.width);
      canvas.width = this.cropImg.width * scale;
      canvas.height = this.cropImg.height * scale;

      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(this.cropImg, 0, 0, canvas.width, canvas.height);

      const margin = canvas.width * 0.1;
      this.cropRect = {
        x: margin,
        y: margin,
        w: canvas.width - margin * 2,
        h: canvas.height - margin * 2,
      };
      this.cdr.detectChanges();
      this.bindCropEvents();
    };
    this.cropImg.src = archivo.url;
  }

  private bindCropEvents(): void {
    document.addEventListener('mousemove', this.onCropMouseMove);
    document.addEventListener('mouseup', this.onCropMouseUp);
  }

  startCropDrag(e: MouseEvent): void {
    e.stopPropagation();
    this.cropDragging = true;
    this.dragStart = {
      x: e.clientX,
      y: e.clientY,
      rx: this.cropRect.x,
      ry: this.cropRect.y,
      rw: this.cropRect.w,
      rh: this.cropRect.h,
    };
  }

  startResize(e: MouseEvent, corner: string): void {
    e.stopPropagation();
    this.cropResizing = true;
    this.resizeCorner = corner;
    this.dragStart = {
      x: e.clientX,
      y: e.clientY,
      rx: this.cropRect.x,
      ry: this.cropRect.y,
      rw: this.cropRect.w,
      rh: this.cropRect.h,
    };
  }

  private onCropMouseMove = (e: MouseEvent): void => {
    const canvas = this.cropCanvasRef?.nativeElement;
    if (!canvas) return;
    const dx = e.clientX - this.dragStart.x;
    const dy = e.clientY - this.dragStart.y;
    const minSize = 40;

    if (this.cropDragging) {
      this.cropRect.x = Math.max(
        0,
        Math.min(canvas.width - this.cropRect.w, this.dragStart.rx + dx),
      );
      this.cropRect.y = Math.max(
        0,
        Math.min(canvas.height - this.cropRect.h, this.dragStart.ry + dy),
      );
      this.cdr.detectChanges();
    }

    if (this.cropResizing) {
      if (this.resizeCorner.includes('e'))
        this.cropRect.w = Math.max(minSize, this.dragStart.rw + dx);
      if (this.resizeCorner.includes('s'))
        this.cropRect.h = Math.max(minSize, this.dragStart.rh + dy);
      if (this.resizeCorner.includes('w')) {
        const newW = Math.max(minSize, this.dragStart.rw - dx);
        this.cropRect.x = this.dragStart.rx + (this.dragStart.rw - newW);
        this.cropRect.w = newW;
      }
      if (this.resizeCorner.includes('n')) {
        const newH = Math.max(minSize, this.dragStart.rh - dy);
        this.cropRect.y = this.dragStart.ry + (this.dragStart.rh - newH);
        this.cropRect.h = newH;
      }
      this.cdr.detectChanges();
    }
  };

  private onCropMouseUp = (): void => {
    this.cropDragging = false;
    this.cropResizing = false;
  };

  aplicarCrop(): void {
    const srcCanvas = this.cropCanvasRef?.nativeElement;
    if (!srcCanvas || !this.cropArchivo) return;

    const scaleX = this.cropImg.naturalWidth / srcCanvas.width;
    const scaleY = this.cropImg.naturalHeight / srcCanvas.height;

    const output = document.createElement('canvas');
    output.width = this.cropRect.w * scaleX;
    output.height = this.cropRect.h * scaleY;

    const ctx = output.getContext('2d')!;
    ctx.drawImage(
      this.cropImg,
      this.cropRect.x * scaleX,
      this.cropRect.y * scaleY,
      output.width,
      output.height,
      0,
      0,
      output.width,
      output.height,
    );

    this.cropArchivo.cropUrl = output.toDataURL('image/jpeg', 0.92);
    this.cerrarCrop();
    this.cdr.detectChanges();
  }

  cerrarCrop(): void {
    document.removeEventListener('mousemove', this.onCropMouseMove);
    document.removeEventListener('mouseup', this.onCropMouseUp);
    this.cropArchivo = null;
    this.cdr.detectChanges();
  }

  // ── Utils ─────────────────────────────────────────────────────────────────

  private dataUrlToFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

  /** Devuelve un ícono SVG según el tipo de archivo */
  iconoPorTipo(tipo: FilePreview['tipo']): string {
    const icons: Record<FilePreview['tipo'], string> = {
      imagen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>`,
      video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m15 10 4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.89L15 14"/><rect x="3" y="6" width="12" height="12" rx="2"/></svg>`,
      audio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
      documento: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
      otro: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>`,
    };
    return icons[tipo];
  }
}
