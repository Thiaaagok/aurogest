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
        canActivate: [AuthGuard]
    },
    {
        path: 'empresas',
        component: GrillaEmpresasComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'proveedores',
        component: GrillaProveedoresComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'productos',
        component: GrillaProductosComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'productos/nuevo',
        component: NuevoProductoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'productos/editar/:id',
        component: EditarProductoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'marcas',
        component: MarcasComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'productos-tipo',
        component: TipoProductoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'productos-categoria',
        component: CategoriaProductoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'stock',
        component: StockComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'compras/nueva',
        component: NuevaCompraComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'compras/grilla',
        component: HistoricoComprasComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'ventas/nueva',
        component: PantallaVentasComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'ventas/grilla',
        component: HistoricoVentas,
        canActivate: [AuthGuard]
    },
];
