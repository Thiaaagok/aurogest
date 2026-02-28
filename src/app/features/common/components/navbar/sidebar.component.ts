// sidebar/sidebar.component.ts
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

// ── Interfaces ─────────────────────────────────────────────────────────────
export interface NavSubItem {
  label: string;
  route: string;
  icon?: string;   // clase PrimeIcon opcional en subitems
}

export interface NavItem {
  key: string;
  label: string;
  icon: string;    // clase PrimeIcon, ej: 'pi pi-home'
  route?: string;
  children?: NavSubItem[];
  badge?: number;
}

export interface NavSection {
  section?: string;
  items: NavItem[];
}

// ── Config — editá solo acá para agregar/quitar rutas ──────────────────────
export const NAV_CONFIG: NavSection[] = [
  {
    section: 'Principal',
    items: [
      { key: 'home', label: 'Inicio', route: '/home', icon: 'pi pi-home' },
    ],
  },
  {
    section: 'Operaciones',
    items: [
      {
        key: 'ventas', label: 'Ventas', icon: 'pi pi-dollar',
        children: [
          { label: 'Nueva',    route: 'ventas/nueva',  icon: 'pi pi-cart-plus' },
          { label: 'Histórico',route: 'ventas/grilla', icon: 'pi pi-align-justify' },
          { label: 'Remitos',       route: '/remitos' },
          { label: 'Facturas AFIP', route: '/facturas-afip' },
        ],
      },
      {
        key: 'compras', label: 'Compras', icon: 'pi pi-shopping-cart',
        children: [
          { label: 'Nueva',     route: 'compras/nueva',  icon: 'pi pi-cart-plus' },
          { label: 'Histórico', route: 'compras/grilla', icon: 'pi pi-align-justify' },
        ],
      },
      {
        key: 'productos', label: 'Productos', icon: 'pi pi-box',
        children: [
          { label: 'Productos',   route: 'productos',          icon: 'pi pi-box' },
          { label: 'Marcas',      route: 'marcas',             icon: 'pi pi-tag' },
          { label: 'Tipos',       route: 'productos-tipo',     icon: 'pi pi-cog' },
          { label: 'Categorías',  route: 'productos-categoria',icon: 'pi pi-cog' },
        ],
      },
      { key: 'stock', label: 'Stock', route: 'stock', icon: 'pi pi-box' },
    ],
  },
  {
    section: 'Gestión',
    items: [
      { key: 'usuarios',    label: 'Usuarios',    route: '/usuarios',    icon: 'pi pi-users' },
      { key: 'proveedores', label: 'Proveedores', route: '/proveedores', icon: 'pi pi-shop' },
    ],
  },
  {
    section: 'Análisis',
    items: [
      { key: 'facturacion', label: 'Facturación', route: '/facturacion', icon: 'pi pi-file-o' },
      {
        key: 'reportes', label: 'Reportes', icon: 'pi pi-chart-bar',
        children: [],   // vacío por ahora, se llena cuando agregues reportes
      },
    ],
  },
];

export const NAV_BOTTOM: NavItem = {
  key: 'configuracion', label: 'Configuración', route: '/configuracion',
  icon: 'pi pi-cog',
};

// ── Componente ─────────────────────────────────────────────────────────────
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  animations: [
    trigger('submenu', [
      state('closed', style({ height: '0px', opacity: 0 })),
      state('open',   style({ height: '*',  opacity: 1 })),
      transition('closed <=> open', animate('220ms cubic-bezier(.4,0,.2,1)')),
    ]),
  ],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">

      <nav class="sidebar-scroll">
        <ng-container *ngFor="let sec of navConfig">

          <div class="section-label" *ngIf="sec.section">{{ sec.section }}</div>

          <ng-container *ngFor="let item of sec.items">

            <!-- Con submenú -->
            <ng-container *ngIf="item.children?.length; else simpleItem">
              <button class="nav-item"
                [class.open]="openMenu === item.key"
                [attr.data-tip]="item.label"
                (click)="toggleMenu(item.key)">
                <span class="nav-icon"><span [class]="item.icon"></span></span>
                <span class="nav-label">{{ item.label }}</span>
                <span class="nav-badge" *ngIf="item.badge && !collapsed">{{ item.badge }}</span>
                <span class="nav-arrow" [class.rotated]="openMenu === item.key">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </span>
              </button>
              <div class="submenu" [@submenu]="openMenu === item.key && !collapsed ? 'open' : 'closed'">
                <a *ngFor="let child of item.children"
                   class="sub-item"
                   [routerLink]="child.route"
                   routerLinkActive="active">
                  <span *ngIf="child.icon" [class]="child.icon" class="sub-icon"></span>
                  <span *ngIf="!child.icon" class="sub-dot"></span>
                  {{ child.label }}
                </a>
              </div>
            </ng-container>

            <!-- Simple -->
            <ng-template #simpleItem>
              <a class="nav-item"
                 [routerLink]="item.route"
                 routerLinkActive="active"
                 [attr.data-tip]="item.label">
                <span class="nav-icon"><span [class]="item.icon"></span></span>
                <span class="nav-label">{{ item.label }}</span>
                <span class="nav-badge" *ngIf="item.badge && !collapsed">{{ item.badge }}</span>
              </a>
            </ng-template>

          </ng-container>
        </ng-container>
      </nav>

      <div class="sidebar-bottom">
        <a class="nav-item" [routerLink]="navBottom.route" routerLinkActive="active" [attr.data-tip]="navBottom.label">
          <span class="nav-icon"><span [class]="navBottom.icon"></span></span>
          <span class="nav-label">{{ navBottom.label }}</span>
        </a>
      </div>

    </aside>
  `,
  styles: [`
    :host { display: contents; }

    .sidebar {
      position: fixed;
      left: 0; top: var(--ag-topbar-h, 58px); bottom: 0;
      width: var(--ag-sidebar-w, 234px);
      background: var(--ag-surface);
      border-right: 1px solid var(--ag-border);
      display: flex; flex-direction: column;
      transition: width .22s cubic-bezier(.4,0,.2,1);
      z-index: 90; overflow: hidden;
    }
    .sidebar.collapsed { width: var(--ag-sidebar-c, 62px); }

    .sidebar-scroll {
      flex: 1; overflow-y: auto; overflow-x: hidden;
      padding: .875rem .5rem;
      scrollbar-width: thin;
      scrollbar-color: var(--ag-surface3) transparent;
    }

    .section-label {
      font-size: .63rem; font-weight: 700;
      letter-spacing: .12em; text-transform: uppercase;
      color: var(--ag-text-faint);
      padding: .625rem .625rem .25rem;
      white-space: nowrap; transition: opacity .15s;
      margin-top: .375rem;
    }
    .sidebar.collapsed .section-label { opacity: 0; pointer-events: none; }

    .nav-item {
      display: flex; align-items: center; gap: .625rem;
      width: 100%; padding: .575rem .675rem;
      border-radius: 9px; border: none; background: transparent;
      color: var(--ag-text-muted); text-decoration: none;
      cursor: pointer; white-space: nowrap; position: relative;
      margin-bottom: 1px;
      transition: background .15s, color .15s;
      font-family: 'DM Sans', sans-serif; font-size: .85rem; text-align: left;
    }
    .nav-item:hover { background: var(--ag-surface2); color: var(--ag-text); }
    .nav-item.active, .nav-item.open {
      background: var(--ag-accent-dim);
      color: var(--ag-accent-light);
    }
    .nav-item.active::before {
      content: ''; position: absolute;
      left: 0; top: 25%; bottom: 25%;
      width: 3px; background: var(--ag-accent);
      border-radius: 0 3px 3px 0;
      box-shadow: 0 0 10px var(--ag-accent-glow);
    }

    .sidebar.collapsed .nav-item::after {
      content: attr(data-tip);
      position: absolute; left: calc(100% + 12px); top: 50%;
      transform: translateY(-50%);
      background: var(--ag-surface3); border: 1px solid var(--ag-border);
      color: var(--ag-text); font-size: .78rem;
      padding: .35rem .75rem; border-radius: 7px;
      white-space: nowrap; pointer-events: none; opacity: 0;
      transition: opacity .12s;
      box-shadow: 0 8px 24px rgba(0,0,0,.3); z-index: 200;
    }
    .sidebar.collapsed .nav-item:hover::after { opacity: 1; }

    .nav-icon { width: 18px; height: 18px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1rem; }

    .sub-icon { font-size: .8rem; flex-shrink: 0; }

    .nav-label {
      font-size: .85rem; flex: 1;
      transition: opacity .15s, max-width .22s;
      overflow: hidden; max-width: 200px;
    }
    .sidebar.collapsed .nav-label { opacity: 0; max-width: 0; }

    .nav-badge {
      background: var(--ag-accent); color: #fff;
      font-size: .62rem; font-weight: 700;
      padding: 1px 7px; border-radius: 20px; flex-shrink: 0;
    }
    .sidebar.collapsed .nav-badge { opacity: 0; }

    .nav-arrow {
      color: var(--ag-text-faint); flex-shrink: 0;
      transition: transform .2s, opacity .15s;
    }
    .nav-arrow.rotated { transform: rotate(90deg); color: var(--ag-accent); }
    .sidebar.collapsed .nav-arrow { opacity: 0; }

    .submenu { overflow: hidden; }
    .sub-item {
      display: flex; align-items: center; gap: .625rem;
      padding: .45rem .625rem .45rem 2.625rem;
      border-radius: 8px; color: var(--ag-text-muted);
      font-size: .82rem; text-decoration: none; cursor: pointer;
      transition: background .15s, color .15s; margin-bottom: 1px;
      font-family: 'DM Sans', sans-serif;
    }
    .sub-item:hover { background: var(--ag-surface2); color: var(--ag-text); }
    .sub-item.active { color: var(--ag-accent-light); }
    .sub-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

    .sidebar-bottom { padding: .625rem .5rem; border-top: 1px solid var(--ag-border); }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;

  readonly navConfig = NAV_CONFIG;
  readonly navBottom = NAV_BOTTOM;

  openMenu: string | null = 'ventas';

  toggleMenu(key: string): void {
    this.openMenu = this.openMenu === key ? null : key;
  }
}














