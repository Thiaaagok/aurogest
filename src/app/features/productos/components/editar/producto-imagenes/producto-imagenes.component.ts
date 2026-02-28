// producto-imagenes/producto-imagenes.component.ts
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../../../common/config/config';

interface ImagenPreview {
  id: string;
  file?: File;
  nombre?: string;
  url: string;
  estado: 'pendiente' | 'subiendo' | 'subido' | 'error';
  progreso: number;
  error?: string;
  // crop
  cropCanvas?: HTMLCanvasElement;
  cropUrl?: string;
}

@Component({
  selector: 'app-producto-imagenes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto-imagenes.component.html',
  styleUrl: './producto-imagenes.component.scss',
})
export class ProductoImagenesComponent implements OnInit {
  @Input() productoId!: string;
  @Input() imagenesIniciales: string[] = [];
  @Output() imagenesChange = new EventEmitter<string[]>(); // ← nuevo

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('cropCanvas') cropCanvasRef!: ElementRef<HTMLCanvasElement>;

  imagenes: ImagenPreview[] = [];
  dragging = false;
  subiendo = false;

  // Drag reorder
  dragIndex = -1;
  dragOverIndex = -1;

  // Crop
  cropImage: ImagenPreview | null = null;
  cropRect = { x: 20, y: 20, w: 200, h: 200 };
  private cropImg = new Image();
  private cropDragging = false;
  private cropResizing = false;
  private resizeCorner = '';
  private dragStart = { x: 0, y: 0, rx: 0, ry: 0, rw: 0, rh: 0 };

  private readonly api = `${Config.APIURL}/producto-imagenes`;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarImagenesIniciales();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imagenesIniciales']) {
      const nuevas: string[] = changes['imagenesIniciales'].currentValue ?? [];
      const yaHayLocales = this.imagenes.some((i) => i.estado !== 'subido');
      if (nuevas.length > 0 && !yaHayLocales) {
        this.cargarImagenesIniciales();
      }
    }
  }

  private cargarImagenesIniciales(): void {
    this.imagenes = (this.imagenesIniciales ?? []).map((nombre) => ({
      id: crypto.randomUUID(),
      nombre,
      url: `${Config.APIURL}/uploads/producto-imagenes/${nombre}`,
      estado: 'subido' as const,
      progreso: 100,
    }));
    this.cdr.detectChanges();
  }

  // ── Getters ────────────────────────────────────────────────────────────
  get hayPendientes(): boolean {
    return this.imagenes.some((i) => i.estado === 'pendiente');
  }
  get cantidadPendientes(): number {
    return this.imagenes.filter((i) => i.estado === 'pendiente').length;
  }

  // ── Drag & drop zona ───────────────────────────────────────────────────
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
    const permitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    const disponibles = 10 - this.imagenes.length;
    files.slice(0, disponibles).forEach((file) => {
      if (!permitidos.includes(file.type)) return;
      if (file.size > 5 * 1024 * 1024) return;
      this.imagenes.push({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        estado: 'pendiente',
        progreso: 0,
      });
    });
  }

  // ── Subir todas las pendientes ─────────────────────────────────────────
  async subirTodas(): Promise<void> {
    const pendientes = this.imagenes.filter((i) => i.estado === 'pendiente');
    this.subiendo = true;

    for (const img of pendientes) {
      await this.subirUna(img);
    }

    // Sincronizar orden en servidor
    await this.sincronizarOrden();
    this.subiendo = false;
  }

  private subirUna(img: ImagenPreview): Promise<void> {
    return new Promise((resolve) => {
      img.estado = 'subiendo';
      img.progreso = 0;

      const formData = new FormData();
      const archivo = img.cropUrl
        ? this.dataUrlToFile(img.cropUrl, img.file!.name)
        : img.file!;
      formData.append('imagenes', archivo);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${this.api}/${this.productoId}`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          img.progreso = Math.round((e.loaded / e.total) * 100);
          this.cdr.detectChanges();
        }
      };

      xhr.onload = () => {
        if (xhr.status === 201 || xhr.status === 200) {
          const resp = JSON.parse(xhr.responseText);
          const nombres: string[] = resp.imagenes;
          // Tomar el último nombre (el que acabamos de subir)
          img.nombre = nombres[nombres.length - 1];
          img.estado = 'subido';
          ((img.url = `${this.api}uploads/producto-imagenes/${img.nombre}`),
            (img.progreso = 100));
          this.emitirCambio();
        } else {
          img.estado = 'error';
          img.error = 'Error al subir';
        }
        this.cdr.detectChanges();
        resolve();
      };

      xhr.onerror = () => {
        img.estado = 'error';
        img.error = 'Sin conexión';
        this.cdr.detectChanges();
        resolve();
      };

      xhr.send(formData);
    });
  }

  // ── Emitir nombres actuales al padre ──────────────────────────────────
  private emitirCambio(): void {
    const nombres = this.imagenes.filter((i) => i.nombre).map((i) => i.nombre!);
    this.imagenesChange.emit(nombres);
  }

  private async sincronizarOrden(): Promise<void> {
    const orden = this.imagenes.filter((i) => i.nombre).map((i) => i.nombre!);
    if (!orden.length) return;
    this.http
      .patch(`${this.api}/${this.productoId}/reorder`, { orden })
      .subscribe();
  }

  // ── Establecer imagen principal ────────────────────────────────────────
  establecerPortada(idx: number): void {
    if (idx === 0) return;
    const arr = [...this.imagenes];
    const [principal] = arr.splice(idx, 1);
    arr.unshift(principal);
    this.imagenes = arr;
    this.emitirCambio();

    // Sincronizar orden en servidor si ya están subidas
    if (this.imagenes.every((i) => i.estado === 'subido')) {
      this.sincronizarOrden();
    }
  }

  // ── Eliminar ───────────────────────────────────────────────────────────
  eliminar(img: ImagenPreview, idx: number): void {
    if (img.estado === 'subido' && img.nombre) {
      this.http
        .delete(`${this.api}/${this.productoId}/${img.nombre}`)
        .subscribe();
    }
    URL.revokeObjectURL(img.url);
    this.imagenes.splice(idx, 1);
    this.emitirCambio();
  }

  // ── Drag reorder (entre items) ─────────────────────────────────────────
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
      const arr = [...this.imagenes];
      const [moved] = arr.splice(this.dragIndex, 1);
      arr.splice(this.dragOverIndex, 0, moved);
      this.imagenes = arr;
      this.emitirCambio();

      // Sincronizar orden si todos están subidos
      if (this.imagenes.every((i) => i.estado === 'subido')) {
        this.sincronizarOrden();
      }
    }
    this.dragIndex = -1;
    this.dragOverIndex = -1;
  }

  // ── Crop ───────────────────────────────────────────────────────────────
  abrirCrop(img: ImagenPreview): void {
    this.cropImage = img;
    setTimeout(() => this.initCropCanvas(img), 50);
  }

  private initCropCanvas(img: ImagenPreview): void {
    const canvas = this.cropCanvasRef?.nativeElement;
    if (!canvas) return;

    this.cropImg.onload = () => {
      const maxW = canvas.parentElement!.clientWidth;
      const scale = Math.min(1, maxW / this.cropImg.width);
      canvas.width = this.cropImg.width * scale;
      canvas.height = this.cropImg.height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(this.cropImg, 0, 0, canvas.width, canvas.height);

      // Selección inicial: 80% del canvas centrado
      const margin = canvas.width * 0.1;
      this.cropRect = {
        x: margin,
        y: margin,
        w: canvas.width - margin * 2,
        h: canvas.height - margin * 2,
      };
      this.cdr.detectChanges();
      this.bindCropEvents(canvas);
    };
    this.cropImg.src = img.url;
  }

  private bindCropEvents(canvas: HTMLCanvasElement): void {
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
      const minSize = 40;
      if (this.resizeCorner.includes('e')) {
        this.cropRect.w = Math.max(minSize, this.dragStart.rw + dx);
      }
      if (this.resizeCorner.includes('s')) {
        this.cropRect.h = Math.max(minSize, this.dragStart.rh + dy);
      }
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
    if (!srcCanvas || !this.cropImage) return;

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

    this.cropImage.cropUrl = output.toDataURL('image/jpeg', 0.92);
    this.cerrarCrop();
    this.cdr.detectChanges();
  }

  cerrarCrop(): void {
    document.removeEventListener('mousemove', this.onCropMouseMove);
    document.removeEventListener('mouseup', this.onCropMouseUp);
    this.cropImage = null;
    this.cdr.detectChanges();
  }

  // ── Util: dataURL → File ────────────────────────────────────────────────
  private dataUrlToFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }
}
