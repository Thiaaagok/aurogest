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

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'usuarios',
        component: GrillaUsuariosComponent
    },
    {
        path: 'empresas',
        component: GrillaEmpresasComponent
    },
    {
        path: 'proveedores',
        component: GrillaProveedoresComponent
    },
    {
        path: 'productos',
        component: GrillaProductosComponent
    },
    {
        path: 'productos/nuevo',
        component: NuevoProductoComponent
    },
    {
        path: 'productos/editar/:id',
        component: EditarProductoComponent
    },
    {
        path: 'marcas',
        component: MarcasComponent
    },
    {
        path: 'productos-tipo',
        component: TipoProductoComponent
    },
    {
        path: 'productos-categoria',
        component: CategoriaProductoComponent
    },
    {
        path: 'stock',
        component: StockComponent
    },
    {
        path: 'compras/nueva',
        component: NuevaCompraComponent
    },
    {
        path: 'ventas/nueva',
        component: PantallaVentasComponent
    }
];
