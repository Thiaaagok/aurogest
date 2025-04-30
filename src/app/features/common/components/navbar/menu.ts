import { MenuItem } from "primeng/api";

export class Modulo {
  label!: string; // Cambiado de 'descripcion' a 'label'
  icon?: string;
  routerLink?: string;
  items?: Modulo[]; // Cambiado de 'hijos' a 'items' (PrimeNG usa 'items')
}

export const Modulos: MenuItem[] = [
  {
    label: 'Inicio',
    icon: 'pi pi-home',
    route: '/inicio',
  },
  {
    label: 'Ventas',
    icon: 'pi pi-shopping-cart',
    items: [
      {
        label: 'Venta',
        icon: 'pi pi-cart-arrow-down',
        route: 'ventas/nueva'
      },
      {
        label: 'Ventas',
        icon: 'pi pi-list',
        route: 'ventas/grilla'
      }
    ]
  },
  {
    label: 'Usuarios',
    icon: 'pi pi-users',
    items: [
      {
        label: 'Grilla',
        icon: 'pi pi-list',
        route: 'usuarios'
      },
      {
        label: 'Nuevo',
        icon: 'pi pi-plus',
        route: 'usuarios/nuevo'
      }
    ]
  },
  {
    label: 'Empresas',
    icon: 'pi pi-building',
    items: [
      {
        label: 'Grilla',
        icon: 'pi pi-list',
        route: 'empresas'
      },
      {
        label: 'Nueva',
        icon: 'pi pi-plus',
        route: 'empresas/nueva'
      }
    ]
  },
  {
    label: 'Proveedores',
    icon: 'pi pi-shop',
    items: [
      {
        label: 'Grilla',
        icon: 'pi pi-list',
        route: 'proveedores'
      },
      {
        label: 'Nuevo',
        icon: 'pi pi-plus',
        route: 'proveedores/nuevo'
      }
    ]
  },
  {
    label: 'Productos',
    icon: 'pi pi-box',
    route: 'productos'
  }
];