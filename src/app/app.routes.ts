import { Routes } from '@angular/router';
import { GrillaUsuariosComponent } from './features/usuarios/components/grilla-usuarios/grilla-usuarios.component';
import { NuevoUsuarioComponent } from './features/usuarios/components/nuevo-usuario/nuevo-usuario.component';
import { EditarUsuarioComponent } from './features/usuarios/components/editar-usuario/editar-usuario.component';
import { GrillaEmpresasComponent } from './features/empresas/components/grilla/grilla-empresas.component';
import { NuevaEmpresaComponent } from './features/empresas/components/nueva/nueva-empresa.component';
import { EditarEmpresaComponent } from './features/empresas/components/editar/editar-empresa.component';
import { GrillaProveedoresComponent } from './features/proveedores/components/grilla/grilla-proveedores.component';
import { NuevoProveedorComponent } from './features/proveedores/components/nuevo/nuevo-proveedor.component';
import { EditarProveedorComponent } from './features/proveedores/components/editar/editar-proveedor.component';
import { PantallaVentasComponent } from './features/ventas/components/pantalla-ventas/pantalla-ventas.component';

export const routes: Routes = [
    {
        path: 'usuarios',
        component: GrillaUsuariosComponent
    },
    {
        path: 'usuarios/nuevo',
        component: NuevoUsuarioComponent
    },
    {
        path: 'usuarios/editar/:id',
        component: EditarUsuarioComponent
    },
    {
        path: 'empresas',
        component: GrillaEmpresasComponent
    },
    {
        path: 'empresas/nueva',
        component: NuevaEmpresaComponent
    },
    {
        path: 'empresas/editar/:id',
        component: EditarEmpresaComponent
    },
    {
        path: 'proveedores',
        component: GrillaProveedoresComponent
    },
    {
        path: 'proveedores/nuevo',
        component: NuevoProveedorComponent
    },
    {
        path: 'proveedores/editar/:id',
        component: EditarProveedorComponent
    },
    {
        path: 'ventas/nueva',
        component: PantallaVentasComponent
    }
];
