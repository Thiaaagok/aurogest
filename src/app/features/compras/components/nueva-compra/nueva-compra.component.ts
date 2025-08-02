import { Component, inject } from '@angular/core';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { ComprasService } from '../../services/compras.service';
import { CompraItemModel, CompraModel } from '../../models/compra.model';
import { ProductoComboModel, ProductoModel } from '../../../productos/models/producto.model';
import { ProveedorModel } from '../../../proveedores/models/proveedor.model';
import { SelectChosenComponent } from '../../../common/components/select-chosen/select-chosen.component';
import { ProveedoresService } from '../../../proveedores/services/proveedores.service';
import { ProductosService } from '../../../productos/services/producto.service';

@Component({
  selector: 'app-nueva-compra',
  imports: [PrimeNgModule,
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    SelectChosenComponent,
    CustomMaterialModule,
    FormsModule,
    InputTextModule,
    ToastModule,
    FloatLabel,
    TextareaModule],
  templateUrl: './nueva-compra.component.html',
  styleUrl: './nueva-compra.component.scss',
})
export class NuevaCompraComponent {
  nuevaCompra: CompraModel = new CompraModel();
  nuevoItem: CompraItemModel = new CompraItemModel();
  productoSeleccionado: ProductoModel = new ProductoModel();

  productosCombo: ProductoComboModel[] = [];
  proveedoresCombo: ProveedorModel[] = [];

  cargando: boolean;

  private comprasService = inject(ComprasService);
  private proveedoresService = inject(ProveedoresService);
  private productosService = inject(ProductosService);

  ngOnInit() {
    this.cargarProductosCombo();
    this.cargarProveedoresCombo();
  }

  editarItem(id: string) {

  }

  onSubmit() {
    this.cargando = true;
    this.comprasService.crear(this.nuevaCompra).subscribe({
      next: (response: CompraModel) => {
        this.cargando = false;
        this.limpiarModel();
      },
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => { },
    });
  }

  cargarProductosCombo() {
    this.productosService.obtenerTodos()
      .subscribe({
        next: (response: ProductoModel[]) => {
          this.productosCombo = response.map(prod => {
            const prodCombo = new ProductoComboModel();
            Object.assign(prodCombo, prod);
            prodCombo.Descripcion = prod.Nombre;
            return prodCombo;
          });
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => { },
      });
  }

  cargarProveedoresCombo() {
    this.proveedoresService.obtenerTodos()
      .subscribe({
        next: (response: ProveedorModel[]) => {
          this.proveedoresCombo = response;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => { },
      });
  }

  crearNuevoItem() {
    if (this.productoSeleccionado) {
      const productoBase = new ProductoModel();
      Object.assign(productoBase, this.productoSeleccionado);
      this.nuevoItem.Producto = productoBase;
    }

    this.nuevaCompra.Items.push(this.nuevoItem);
    this.nuevoItem = new CompraItemModel();
  }

  limpiarModel() {
    this.nuevaCompra = new CompraModel();
  }

}
