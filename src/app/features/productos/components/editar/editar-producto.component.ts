import { Component, inject } from '@angular/core';
import { ProductoModel } from '../../models/producto.model';
import { ProductoTipoModel } from '../../models/producto-tipo.model';
import { ProveedorModel } from '../../../proveedores/models/proveedor.model';
import { ProductosService } from '../../services/producto.service';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { ProductoCategoriaModel } from '../../models/producto-categoria.model';
import { ProductoTiposService } from '../../services/producto-tipo.service';
import { ProductoCategoriasService } from '../../services/producto-categoria.service';
import { ProveedoresService } from '../../../proveedores/services/proveedores.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FloatLabel } from 'primeng/floatlabel';
import { MarcaModel } from '../../models/marca.model';
import { MarcasService } from '../../services/marcas.service';
import { Select } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadEvent } from 'primeng/fileupload';
import { ProductoImagenesComponent } from './producto-imagenes/producto-imagenes.component';

@Component({
  selector: 'app-editar-producto',
  imports: [PrimeNgModule, CustomMaterialModule, ReactiveFormsModule, FormsModule, CommonModule,
    InputTextModule,
    ToastModule,
    FloatLabel, Select, MultiSelectModule, ProductoImagenesComponent],
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.scss',
})
export class EditarProductoComponent {
  productoEditar: ProductoModel = new ProductoModel();
  cargando: boolean;
  parametro: string;
  tiposProductosCombo: ProductoTipoModel[] = [];
  marcasProductosCombo: MarcaModel[] = [];
  proveedoresCombo: ProveedorModel[] = [];
  categoriasProductosCombo: ProductoCategoriaModel[] = [];
  ImagenesProducto: File[] = [];

  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private productosService = inject(ProductosService);
  private proveedoresService = inject(ProveedoresService);
  private productoTiposService = inject(ProductoTiposService);
  private productoCategoriasService = inject(ProductoCategoriasService);
  private marcasService = inject(MarcasService)

  ngOnInit() {
    this.parametro = this.config.data;
    this.obtenerProducto();
    this.cargarTiposProductosCombo();
    this.cargarMarcasProductosCombo();
    this.cargarCategoriasProductosCombo();
    this.cargarProveedoresCombo();
  }

  onSubmit() {
    this.cargando = true;
    this.productosService.editar(this.productoEditar.Id, this.productoEditar).subscribe({
      next: (response: ProductoModel) => {
        this.cargando = false;
        this.ref.close();
      },
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => { },
    });
  }

  onImagenesChange(imagenes: string[]): void {
    this.productoEditar.Imagenes = imagenes;
  } 

  obtenerProducto() {
    this.cargando = true;
    this.productosService.obtenerPorId(this.parametro).subscribe({
      next: (response: ProductoModel) => {
        this.cargando = false;
        this.productoEditar = response;
        console.log(this.productoEditar.Imagenes)
      },
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => { },
    });
  }

  eliminarProducto() {
    this.productosService.eliminar(this.productoEditar.Id)
      .subscribe({
        next: ((response: boolean) => {
          this.cargando = false;
          this.obtenerProducto();
        }),
        error: (err) => {
          this.cargando = false;
          console.log(err);
        },
        complete: () => { }
      })
  }

  reactivarProducto() {
    this.productosService.reactivar(this.productoEditar.Id)
      .subscribe({
        next: ((response: boolean) => {
          this.cargando = false;
          this.obtenerProducto();
        }),
        error: (err) => {
          this.cargando = false;
          console.log(err);
        },
        complete: () => { }
      })
  }


  cerrar() {
    this.ref.close();
  }

  cargarTiposProductosCombo() {
    this.productoTiposService.obtenerTodos()
      .subscribe({
        next: (response: ProductoTipoModel[]) => {
          this.cargando = false;
          this.tiposProductosCombo = response;
        },
        error: (err) => {
          this.cargando = false;
          console.log(err);
        },
        complete: () => { },
      });
  }

  cargarMarcasProductosCombo() {
    this.marcasService.obtenerTodos()
      .subscribe({
        next: (response: MarcaModel[]) => {
          this.cargando = false;
          this.marcasProductosCombo = response;
        },
        error: (err) => {
          this.cargando = false;
          console.log(err);
        },
        complete: () => { },
      });
  }

  cargarCategoriasProductosCombo() {
    this.productoCategoriasService.obtenerTodos()
      .subscribe({
        next: (response: ProductoCategoriaModel[]) => {
          this.cargando = false;
          this.categoriasProductosCombo = response;
        },
        error: (err) => {
          this.cargando = false;
          console.log(err);
        },
        complete: () => { },
      });
  }

  cargarProveedoresCombo() {
    this.proveedoresService.obtenerTodos()
      .subscribe({
        next: (response: ProveedorModel[]) => {
          this.cargando = false;
          this.proveedoresCombo = response;
        },
        error: (err) => {
          this.cargando = false;
          console.log(err);
        },
        complete: () => { },
      });
  }

  limpiarModel() {
    this.productoEditar = new ProductoModel();
  }

  columnasFormulario: number = 1;

  get gridStyles() {
    return {
      'grid-template-columns': `repeat(${this.columnasFormulario}, 1fr)`
    };
  }

  imagenPreview: string | ArrayBuffer | null = null;

  subirImagen(event: any) {
    const file: File = event.files[0];
    if (!file) return;
    this.productoEditar.Imagen = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagenPreview = reader.result;
    };
    reader.readAsDataURL(file);

    event.options.clear();
  }

  onUpload(event: FileUploadEvent) {
    for (let file of event.files) {
      this.ImagenesProducto.push(file);
    }
    this.subir();
  }

  subir() {
    this.productosService.subirImagenes(this.ImagenesProducto)
      .subscribe(urls => {
        this.productoEditar.Imagenes = urls;
      });
  }


}
