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
    route: '/usuarios'
  },
  {
    label: 'Empresas',
    icon: 'pi pi-building',
    route: '/empresas'
  },
  {
    label: 'Proveedores',
    icon: 'pi pi-shop',
    route: '/proveedores'
  },
  {
    label: 'Productos',
    icon: 'pi pi-box',
    items: [
      {
        label: 'Productos',
        icon: 'pi pi-box',
        route: 'productos'
      },
      {
        label: 'Marcas',
        icon: 'pi pi-tag',
        route: 'marcas'
      },
      {
        label: 'Tipos',
        icon: 'pi pi-cog',
        route: 'productos-tipo'
      },
      {
        label: 'Categorias',
        icon: 'pi pi-cog',
        route: 'productos-categoria'
      }
    ]
  },
  {
    label: 'Stock',
    icon: 'pi pi-box',
    route: 'stock'
  }
];