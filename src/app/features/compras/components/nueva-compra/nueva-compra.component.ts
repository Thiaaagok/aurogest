import { Component, inject } from '@angular/core';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { ComprasService } from '../../services/compras.service';
import { CompraItemModel, CompraModel } from '../../models/compra.model';
import { ProductoModel } from '../../../productos/models/producto.model';
import { ProveedorModel } from '../../../proveedores/models/proveedor.model';
import { ProductosService } from '../../../productos/services/producto.service';
import { QrScannerService } from '../../../common/services/qrScanner.service';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { Select } from 'primeng/select';
import { AlertasService } from '../../../common/services/alertas.service';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { EditarPrecioComponent } from '../../../productos/components/grilla/editar-precio/editar-precio.component';

@Component({
  selector: 'app-nueva-compra',
  imports: [PrimeNgModule,
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    CustomMaterialModule,
    FormsModule,
    InputTextModule,
    ToastModule,
    FloatLabel,
    TextareaModule,
    DropdownModule,
    ButtonModule,
    MessageModule, Select, FloatLabel],
  templateUrl: './nueva-compra.component.html',
  styleUrl: './nueva-compra.component.scss',
})
export class NuevaCompraComponent {
  nuevaCompra: CompraModel = new CompraModel();
  nuevoItem: CompraItemModel = new CompraItemModel();
  productoSeleccionado: string;

  productosCombo: ProductoModel[] = [];
  proveedoresCombo: ProveedorModel[] = [];

  codigoBarra: string;
  cargando: boolean;

  private comprasService = inject(ComprasService);
  private productosService = inject(ProductosService);
  private qrService = inject(QrScannerService);
  private alertasService = inject(AlertasService);
  private messageService = inject(MessageService);
  private dialogService = inject(DialogService);
  private router = inject(Router);

  ngOnInit() {
    this.cargarProductosCombo();
    this.qrService.qrScanned.subscribe((qr: string) => {
      this.codigoBarra = qr;
      this.obtenerProductoEscaneado();
    });
  }

  obtenerProductoEscaneado() {
    this.productosService.obtenerProductoPorCodigoBarra(this.codigoBarra)
      .subscribe({
        next: (response: ProductoModel) => {
          this.messageService.add(({ severity: 'success', summary: 'QR ESCANEADO', detail: 'El producto se escaneo correctamente' }));
          this.productoSeleccionado = response.Id;
          this.productoSeleccionadoEvent(response.Id);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => { },
      })
  }

  crearNuevoItem() {
    if (this.verificarItem()) {
      this.nuevaCompra.Items.push(this.nuevoItem);
      this.limpiarProductoSeleccionado();
    } else {
      this.alertasService.advertenciaAlerta(
        'No se pudo agregar el item',
        'Este producto y proveedor ya están registrados en la compra.'
      );
    }
  }

  limpiarModel() {
    this.nuevaCompra = new CompraModel();
  }

  productoSeleccionadoEvent(productoId: string) {
    this.productoSeleccionado = productoId;
    this.nuevoItem.Proveedor = undefined;
    this.nuevoItem.Subtotal = 0;
    const producto = this.productosCombo.find(p => p.Id == productoId);
    if (producto) {
      this.nuevoItem.Producto = producto;
      this.nuevoItem.PrecioUnitarioCompra = producto.PrecioCompra;
      this.proveedoresCombo = producto.Proveedores;
      this.nuevoItem.Subtotal = producto.PrecioCompra * this.nuevoItem.Cantidad;
    }
  }

  disminuirCantidad(event: MouseEvent, compraItem: CompraItemModel) {
    event.stopPropagation();
    if (compraItem.Cantidad > 1) {
      compraItem.Cantidad--;
      compraItem.Subtotal = +(
        compraItem.Producto.PrecioCompra * compraItem.Cantidad
      ).toFixed(2);
    }
  }

  aumentarCantidad(event: MouseEvent, compraItem: CompraItemModel) {
    event.stopPropagation();
    compraItem.Cantidad++;
    compraItem.Subtotal = +(
      compraItem.Producto.PrecioCompra * compraItem.Cantidad
    ).toFixed(2);
  }

  cambiarCantidad(valor: number, compraItem: CompraItemModel) {
    if (valor < 0 || valor == null) {
      compraItem.Cantidad = 0;
    }
    compraItem.Subtotal = +(
      compraItem.Producto.PrecioCompra * compraItem.Cantidad
    ).toFixed(2);
  }

  verificarItem() {
    const productoVerificar = this.nuevoItem.Producto;
    const proveedorVerificar = this.nuevoItem.Proveedor;
    return !this.nuevaCompra.Items.some(item => item.Producto.Id == productoVerificar.Id && item.Proveedor == proveedorVerificar);
  }

  cantidadCambio(cantidadNueva: number) {
    this.nuevoItem.Subtotal = this.nuevoItem.Producto.PrecioCompra * cantidadNueva;
  }

  limpiarProductoSeleccionado() {
    this.productoSeleccionado = "";
    this.nuevoItem = new CompraItemModel();
    this.proveedoresCombo = [];
    this.nuevoItem.Subtotal = 0;
  }

  descargar(compra: CompraModel) {
    this.comprasService.descargarRemito(compra).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `remito-${compra.Id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  eliminarItem(compraItem: CompraItemModel) {
    this.alertasService.confirmacionAlerta(
      'Confirmar eliminación',
      `Vas a eliminar el ítem "${compraItem.Producto?.Descripcion ?? 'sin descripción'}" de la compra. 
      Esta acción no se puede deshacer. ¿Deseas continuar?`
    ).then((result) => {
      if (result.isConfirmed) {
        const index = this.nuevaCompra.Items.findIndex(item => item.Id == compraItem.Id);
        if (index >= 0) {
          this.nuevaCompra.Items.splice(index, 1);
        }
      }
    });
  }

  editarItem(id: string) {

  }

  onSubmit() {
    this.cargando = true;
    this.nuevaCompra.Fecha = new Date();
    this.nuevaCompra.Total = +this.nuevaCompra.Items
      .reduce((acc, item) => acc + item.Subtotal, 0)
      .toFixed(2);
    this.nuevaCompra.Items.forEach(item => {
      this.nuevaCompra.ProductosId.push(item.Producto.Id);
    })
    this.comprasService.crear(this.nuevaCompra).subscribe({
      next: (response: CompraModel) => {
        this.cargando = false;
        this.descargar(response);
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
          this.productosCombo = response.filter(producto => producto.Activo);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => { },
      });
  }

  editarPrecioCompra(compraItem: CompraItemModel) {
    const dialog = this.dialogService.open(EditarPrecioComponent, {
      header: 'Editar precio compra',
      width: '50%',
      height: 'fit-content',
      data: {
        Producto: compraItem.Producto,
        Tipo: 'COMPRA'
      },
      modal: true,
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent'
    });


    dialog.onClose
      .subscribe((response: any) => {
        if (response.resultado) {
          compraItem.PrecioUnitarioCompra = parseFloat(Number(response.nuevoPrecio).toFixed(2));
          compraItem.Subtotal = parseFloat(
            (compraItem.PrecioUnitarioCompra * compraItem.Cantidad).toFixed(2)
          );
        }
      })
  }

  verHistorialCompras() {
    this.router.navigateByUrl('compras/grilla');
  }

}
