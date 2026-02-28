// topbar/topbar.component.ts
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemePickerComponent } from '../../../../theme-picker.component';
import { ThemeService } from '../../../../theme.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemePickerComponent],
  template: `
    <header class="topbar">

      <!-- Brand -->
      <div class="brand" [class.collapsed]="collapsed">
        <div class="brand-logo">
          <span class="brand-name" [class.hidden]="collapsed">AUROGEST</span>
        </div>
      </div>

      <!-- Toggle -->
      <button class="icon-btn toggle-btn" (click)="toggleCollapse.emit()" title="Contraer menú">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <!-- Right actions -->
      <div class="topbar-right">

        <!-- Nueva venta CTA -->
        <a class="cta-btn" routerLink="/ventas/nueva">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nueva Venta
        </a>

        <div class="divider"></div>

        <!-- Notificaciones -->
        <button class="icon-btn notif-btn" title="Notificaciones">
          <span class="notif-dot"></span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>

        <!-- Theme picker -->
        <app-theme-picker></app-theme-picker>

        <div class="divider"></div>

        <!-- User -->
        <button class="user-btn">
          <div class="user-avatar">JD</div>
          <div class="user-info">
            <span class="user-name">Juan Díaz</span>
            <span class="user-role">Administrador</span>
          </div>
          <svg class="user-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

      </div>
    </header>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

    :host { display: contents; }

    .topbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: var(--ag-topbar-h, 58px);
      z-index: 100;
      display: flex;
      align-items: center;
      gap: .5rem;
      padding: 0 1.25rem 0 0;
      background: var(--ag-surface);
      border-bottom: 1px solid var(--ag-border);
    }

    /* Brand */
    .brand {
      width: var(--ag-sidebar-w, 234px);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      padding: 0 1rem;
      transition: width .22s cubic-bezier(.4,0,.2,1);
      overflow: hidden;
    }
    .brand.collapsed { width: var(--ag-sidebar-c, 62px); }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: .625rem;
      text-decoration: none;
      white-space: nowrap;
    }

    .brand-svg {
      width: 28px; height: 22px;
      flex-shrink: 0;
      filter: drop-shadow(0 0 6px var(--ag-accent-glow));
    }

    .brand-name {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 1.2rem;
      letter-spacing: .1em;
      color: var(--ag-text);
      transition: opacity .15s, max-width .22s;
      overflow: hidden;
    }
    .brand-name.hidden { opacity: 0; max-width: 0; }

    /* Toggle */
    .toggle-btn { margin-right: .25rem; flex-shrink: 0; }

    /* Search */
    .search-wrap {
      flex: 1;
      max-width: 380px;
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-ico {
      position: absolute;
      left: .875rem;
      color: var(--ag-text-muted);
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      background: var(--ag-surface2);
      border: 1px solid var(--ag-border);
      border-radius: 9px;
      padding: .5rem 3rem .5rem 2.5rem;
      color: var(--ag-text);
      font-family: 'DM Sans', sans-serif;
      font-size: .84rem;
      outline: none;
      transition: border-color .15s, box-shadow .15s;
    }
    .search-input:focus {
      border-color: var(--ag-accent);
      box-shadow: 0 0 0 3px var(--ag-accent-dim);
    }
    .search-input::placeholder { color: var(--ag-text-muted); }
    .search-shortcut {
      position: absolute;
      right: .75rem;
      font-size: .68rem;
      color: var(--ag-text-faint);
      background: var(--ag-surface3);
      border: 1px solid var(--ag-border);
      padding: 1px 6px;
      border-radius: 5px;
      pointer-events: none;
    }

    /* Right */
    .topbar-right {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: .375rem;
    }

    /* CTA */
    .cta-btn {
      display: inline-flex;
      align-items: center;
      gap: .375rem;
      padding: .45rem 1rem;
      background: var(--ag-accent-dim);
      border: 1px solid var(--ag-accent-glow);
      border-radius: 9px;
      color: var(--ag-accent-light);
      font-size: .8rem;
      font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      text-decoration: none;
      cursor: pointer;
      transition: background .15s, box-shadow .15s;
      white-space: nowrap;
    }
    .cta-btn:hover {
      background: var(--ag-accent-glow);
      box-shadow: 0 0 12px var(--ag-accent-glow);
    }

    /* Icon btn */
    .icon-btn {
      width: 36px; height: 36px;
      border: none;
      background: transparent;
      border-radius: 9px;
      color: var(--ag-text-muted);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background .15s, color .15s;
      position: relative;
      flex-shrink: 0;
    }
    .icon-btn:hover { background: var(--ag-surface3); color: var(--ag-text); }

    .notif-dot {
      position: absolute;
      top: 6px; right: 6px;
      width: 7px; height: 7px;
      border-radius: 50%;
      background: var(--ag-accent);
      border: 2px solid var(--ag-surface);
    }

    /* Divider */
    .divider {
      width: 1px; height: 20px;
      background: var(--ag-border);
      margin: 0 .25rem;
      flex-shrink: 0;
    }

    /* User */
    .user-btn {
      display: flex;
      align-items: center;
      gap: .5rem;
      padding: .375rem .625rem;
      background: transparent;
      border: none;
      border-radius: 9px;
      cursor: pointer;
      transition: background .15s;
    }
    .user-btn:hover { background: var(--ag-surface2); }

    .user-avatar {
      width: 30px; height: 30px;
      border-radius: 8px;
      background: var(--ag-accent);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Syne', sans-serif;
      font-size: .72rem;
      font-weight: 700;
      color: #fff;
      flex-shrink: 0;
      box-shadow: 0 0 10px var(--ag-accent-glow);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1px;
    }
    .user-name {
      font-size: .8rem;
      font-weight: 500;
      color: var(--ag-text);
      line-height: 1.1;
      font-family: 'DM Sans', sans-serif;
    }
    .user-role {
      font-size: .68rem;
      color: var(--ag-text-muted);
      line-height: 1.1;
      font-family: 'DM Sans', sans-serif;
    }
    .user-chevron { color: var(--ag-text-faint); flex-shrink: 0; }
  `]
})
export class TopbarComponent {
  @Input()  collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();
  theme = inject(ThemeService);
}
