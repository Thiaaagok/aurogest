import { Component, inject, ViewChild } from '@angular/core';
import { ProductoDetalleModel, ProductoModel } from '../../models/producto.model';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/producto.service';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { SelectChosenComponent } from '../../../common/components/select-chosen/select-chosen.component';
import { ProductoTipoModel } from '../../models/producto-tipo.model';
import { MarcaModel } from '../../../marcas/models/marca.model';
import { ProveedorModel } from '../../../proveedores/models/proveedor.model';
import { ProveedoresService } from '../../../proveedores/services/proveedores.service';
import { ProductoCategoriaModel } from '../../models/producto-categoria.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nuevo-producto',
  imports: [PrimeNgModule, CustomMaterialModule, SelectChosenComponent, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './nuevo-producto.component.html',
  styleUrl: './nuevo-producto.component.scss',
})
export class NuevoProductoComponent { 

  nuevoProducto: ProductoModel = new ProductoModel();
  cargando: boolean;
  cantidad: number = 1;
  tiposProductosCombo: ProductoTipoModel[] = [];
  marcasProductosCombo: MarcaModel[] = [];
  proveedoresCombo: ProveedorModel[] = [];
  categoriasProductosCombo: ProductoCategoriaModel[] = [];

  private router = inject(Router);
  private productosService = inject(ProductosService);
  private proveedoresService = inject(ProveedoresService);

  constructor(){
  }

  ngOnInit() {
    this.cargarTiposProductosCombo();
    this.cargarMarcasProductosCombo();
    this.cargarProveedoresCombo();
  }

  onSubmit() {
    this.cargando = true;
    this.productosService.crear(this.nuevoProducto)
      .subscribe({
        next: (response: ProductoModel) => {
          this.cargando = false;
          this.limpiarModel();
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {},
      });
  }

  volver() {
    this.router.navigateByUrl('productos');
  }
  
  cargarTiposProductosCombo(){}

  cargarMarcasProductosCombo(){}

  cargarCategoriasProductosCombo(){}

  cargarProveedoresCombo(){
    this.proveedoresService.obtenerTodos()
    .subscribe({
      next: (response: ProveedorModel[]) => {
        this.cargando = false;
        this.proveedoresCombo = response;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  limpiarModel(){
    this.nuevoProducto = new ProductoModel();
  }

  onImagenPrincipalChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.nuevoProducto.ImagenPresentacion = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onImagenesAdicionalesChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      const imageUrl = URL.createObjectURL(file);
      this.nuevoProducto.Imagenes = [...this.nuevoProducto.Imagenes, imageUrl];
    }
  }

  eliminarImagen(imagenEliminar: string) {
    this.nuevoProducto.Imagenes = this.nuevoProducto.Imagenes.filter(
      imagen => imagen !== imagenEliminar
    );
  }

  agregarNuevoDetalle(){
    const nuevoDetalle: ProductoDetalleModel = new ProductoDetalleModel();
    this.nuevoProducto.Detalles.push(nuevoDetalle);
  }

  eliminarDetalle(i:number){
    this.nuevoProducto.Detalles.splice(i, 1);
  }
}
