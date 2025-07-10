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
import { ProductoCategoriaModel } from '../../models/producto-categoria.model';
import { ProductoTiposService } from '../../services/producto-tipo.service';
import { ProductoCategoriasService } from '../../services/producto-categoria.service';
import { MarcasService } from '../../../marcas/services/marcas.service';
import { ProveedoresService } from '../../../proveedores/services/proveedores.service';

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
  categoriasProductosCombo: ProductoCategoriaModel[] = [];

  private router = inject(Router);
  private productosService = inject(ProductosService);
  private activatedRoute = inject(ActivatedRoute);
  private proveedoresService = inject(ProveedoresService);
  private productoTiposService = inject(ProductoTiposService);
  private productoCategoriasService = inject(ProductoCategoriasService);
  private marcasService = inject(MarcasService)

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.parametro = params['id'];
      this.obtenerProducto();
    });
  }

  ngOnInit() {
    this.cargarTiposProductosCombo();
    this.cargarMarcasProductosCombo();
    this.cargarCategoriasProductosCombo();
    this.cargarProveedoresCombo();
  }

  onSubmit() {
    this.cargando = true;
    this.productosService.editar(this.productoEditar.Id,this.productoEditar).subscribe({
      next: (response: ProductoModel) => {
        timer(2000)
        .subscribe(() => {
          this.cargando = false;
          this.obtenerProducto();
        })
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
  
  cargarTiposProductosCombo(){
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
      complete: () => {},
    });
  }

  cargarMarcasProductosCombo(){
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
      complete: () => {},
    });
  }

  cargarCategoriasProductosCombo(){
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
      complete: () => {},
    });
  }

  cargarProveedoresCombo(){
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
      complete: () => {},
    });
  }

  limpiarModel(){
    this.productoEditar = new ProductoModel();
  }

  agregarNuevoDetalle(){
    const nuevoDetalle: ProductoDetalleModel = new ProductoDetalleModel();
    this.productoEditar.Detalles.push(nuevoDetalle);
  }

  eliminarDetalle(i:number){
    this.productoEditar.Detalles.splice(i, 1);
  }
}
