import { Routes } from '@angular/router';
import { GrillaUsuariosComponent } from './features/usuarios/components/grilla-usuarios/grilla-usuarios.component';
import { GrillaEmpresasComponent } from './features/empresas/components/grilla/grilla-empresas.component';
import { GrillaProveedoresComponent } from './features/proveedores/components/grilla/grilla-proveedores.component';
import { GrillaProductosComponent } from './features/productos/components/grilla/grilla-productos.component';
import { HomeComponent } from './features/common/components/home/home.component';
import { EditarProductoComponent } from './features/productos/components/editar/editar-producto.component';
import { TipoProductoComponent } from './features/productos/components/configuracion/tipo-producto/tipo-producto.component';
import { CategoriaProductoComponent } from './features/productos/components/configuracion/categoria-producto/categoria-producto.component';
import { NuevoProductoComponent } from './features/productos/components/nuevo/nuevo-producto.component';
import { StockComponent } from './features/stock/components/stock/stock.component';
import { MarcasComponent } from './features/productos/components/configuracion/marcas/marcas.component';
import { LoginComponent } from './features/common/components/login/login.component';
import { NuevaCompraComponent } from './features/compras/components/nueva-compra/nueva-compra.component';
import { PantallaVentasComponent } from './features/ventas/components/pantalla-ventas/pantalla-ventas.component';
import { HistoricoComprasComponent } from './features/compras/components/historico-compras/historico-compras.component';
import { AuthGuard } from './features/auth/guards/auth.guard';
import { HistoricoVentas } from './features/ventas/components/historico-ventas/historico-ventas';
import { Permisos } from './features/common/enums/roles.enum';
import { RolesUsuario } from './features/roles-usuario/components/roles-usuario';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'usuarios',
    component: GrillaUsuariosComponent,
    canActivate: [AuthGuard],
    data: { permiso: Permisos.VER_USUARIOS }
  },
  {
    path: 'roles-usuario',
    component: RolesUsuario,
    canActivate: [AuthGuard],
    data: { permiso: Permisos.VER_ROLES }
  },
  {
    path: 'empresas',
    component: GrillaEmpresasComponent,
    canActivate: [AuthGuard],
    data: { permiso: Permisos.VER_EMPRESAS }
  },
  {
    path: 'proveedores',
    component: GrillaProveedoresComponent,
    canActivate: [AuthGuard],
    data: { permiso: Permisos.VER_PROVEEDORES }
  },
  {
    path: 'productos',
    component: GrillaProductosComponent,
    canActivate: [AuthGuard],
    data: { permiso: Permisos.VER_PRODUCTOS }
  },
  {
    path: 'productos/nuevo',
    component: NuevoProductoComponent,
    canActivate: [AuthGuard],
    data: { permiso: Permisos.CREAR_PRODUCTO }
  },
  {
    path: 'productos/editar/:id',
    component: EditarProductoComponent,
    canActivate: [AuthGuard],
    data: { permiso: Permisos.EDITAR_PRODUCTO }
  },
  {
    path: 'marcas',
    component: MarcasComponent,
    canActivate: [AuthGuard],
    data: { permiso: Permisos.VER_MARCAS }
  },
  {
    path: 'productos-tipo',
    component: TipoProductoComponent,
    canActivate: [AuthGuard],
    data: { permiso: Permisos.VER_TIPOS_PRODUCTO }
  },
  {
    path: 'productos-categoria',
    component: CategoriaProductoComponent,
    canActivate: [AuthGuard],
    data: { permiso: Permisos.VER_CATEGORIAS_PRODUCTO }
  },
  {
    path: 'stock',
    component: StockComponent,
    canActivate: [AuthGuard],
    data: { permiso: Permisos.VER_STOCK }
  },
  {
    path: 'compras/nueva',
    component: NuevaCompraComponent,
    canActivate: [AuthGuard],
    data: { permiso: Permisos.CREAR_COMPRA }
  },
  {
    path: 'compras/grilla',
    component: HistoricoComprasComponent,
    canActivate: [AuthGuard],
    data: { permiso: Permisos.VER_HISTORICO_COMPRAS }
  },
  {
    path: 'ventas/nueva',
    component: PantallaVentasComponent,
    canActivate: [AuthGuard],
    data: { permiso: Permisos.CREAR_VENTA }
  },
  {
    path: 'ventas/grilla',
    component: HistoricoVentas,
    canActivate: [AuthGuard],
    data: { permiso: Permisos.VER_HISTORICO_VENTAS }
  },
];