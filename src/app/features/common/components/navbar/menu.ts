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
    route: '/home',
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
  },
  {
    label: 'Compras',
    icon: 'pi pi-shopping-cart',
    items: [
      {
        label: 'Nueva',
        icon: 'pi pi-cart-plus',
        route: 'compras/nueva'
      },
      {
        label: 'Historico',
        icon: 'pi pi-align-justify',
        route: 'compras/grilla'
      }
    ]
  },
  {
    label: 'Ventas',
    icon: 'pi pi-dollar',
    items: [
      {
        label: 'Nueva',
        icon: 'pi pi-cart-plus',
        route: 'ventas/nueva'
      },
      {
        label: 'Historico',
        icon: 'pi pi-align-justify',
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
    label: 'Proveedores',
    icon: 'pi pi-shop',
    route: '/proveedores'
  },
  {
    label: 'Facturación',
    icon: 'pi pi-file-o',
    route: '/facturacion'
  },
  {
    label: 'Reportes',
    icon: 'pi pi-chart-bar',
    items: [
    ]
  }
];