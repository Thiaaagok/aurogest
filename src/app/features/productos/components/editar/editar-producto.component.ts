import { Component, inject } from '@angular/core';
import { ProductoDetalleModel, ProductoModel } from '../../models/producto.model';
import { ProductoTipoModel } from '../../models/producto-tipo.model';
import { MarcaModel } from '../../../marcas/models/marca.model';
import { ProveedorModel } from '../../../proveedores/models/proveedor.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from '../../services/producto.service';
import { SelectChosenComponent } from '../../../common/components/select-chosen/select-chosen.component';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { timer } from 'rxjs';

@Component({
  selector: 'app-editar-producto',
  imports: [PrimeNgModule, CustomMaterialModule, SelectChosenComponent],
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.scss',
})
export class EditarProductoComponent { 
  productoEditar: ProductoModel = new ProductoModel();
  cargando: boolean;
  parametro: string;
  cantidad: number = 1;
  tiposProductosCombo: ProductoTipoModel[] = [];
  marcasProductosCombo: MarcaModel[] = [];
  proveedoresCombo: ProveedorModel[] = [];

  private router = inject(Router);
  private productosService = inject(ProductosService);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.parametro = params['id'];
      this.obtenerProducto();
    });
  }

  ngOnInit() {
    this.cargarTiposProductosCombo();
    this.cargarMarcasProductosCombo();
    this.cargarProveedoresCombo();
  }

  onSubmit() {
    this.cargando = true;
    this.productosService.crear(this.productoEditar).subscribe({
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

  obtenerProducto() {
    this.cargando = true;
    this.productosService.obtenerPorId(this.parametro).subscribe({
      next: (response: ProductoModel) => {
        this.cargando = false;
        this.productoEditar = response;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  eliminarProducto(){
    this.productosService.eliminar(this.productoEditar.Id)
    .subscribe({
      next: ((response: boolean) => {
        this.cargando = false;
        timer(300).subscribe(() => {
          this.obtenerProducto();
        });
      }),
      error: (err) => {
        console.log(err);
      },
      complete: () => {}
    })
  }

  reactivarProducto(){
    this.productosService.reactivar(this.productoEditar.Id)
    .subscribe({
      next: ((response: boolean) => {
        this.cargando = false;
        timer(300).subscribe(() => {
          this.obtenerProducto();
        });
      }),
      error: (err) => {
        console.log(err);
      },
      complete: () => {}
    })
  }
  

  volver() {
    this.router.navigateByUrl('productos');
  }
  
  cargarTiposProductosCombo(){}

  cargarMarcasProductosCombo(){}

  cargarProveedoresCombo(){}

  limpiarModel(){
    this.productoEditar = new ProductoModel();
  }

  onImagenPrincipalChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.productoEditar.ImagenPresentacion = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onImagenesAdicionalesChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      const imageUrl = URL.createObjectURL(file);
      this.productoEditar.Imagenes = [...this.productoEditar.Imagenes, imageUrl];
    }
  }

  eliminarImagen(imagenEliminar: string) {
    this.productoEditar.Imagenes = this.productoEditar.Imagenes.filter(
      imagen => imagen !== imagenEliminar
    );
  }

  agregarNuevoDetalle(){
    const nuevoDetalle: ProductoDetalleModel = new ProductoDetalleModel();
    this.productoEditar.Detalles.push(nuevoDetalle);
  }

  eliminarDetalle(i:number){
    this.productoEditar.Detalles.splice(i, 1);
  }
}
