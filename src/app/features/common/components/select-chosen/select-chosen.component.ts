import {
  Component,
  Output,
  EventEmitter,
  forwardRef,
  HostBinding,
  OnChanges } from '@angular/core';
import { Input, OnDestroy } from '@angular/core';
import { UntypedFormControl, NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SimpleChanges } from '@angular/core';
// FontAwesome
import { faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { isNullOrUndefined } from '../../util/util';
import { CustomMaterialModule } from '../../material/custom-material.module';
import { CommonModule } from '@angular/common';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectChosenComponent),
  multi: true
};
@Component({
    selector: 'app-select-chosen',
    templateUrl: './select-chosen.component.html',
    styleUrls: ['./select-chosen.component.scss'],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,NgxMatSelectSearchModule],
    imports: [CustomMaterialModule, CommonModule, FormsModule, ReactiveFormsModule,NgxMatSelectSearchModule]
})
export class SelectChosenComponent implements OnChanges, OnDestroy {

  @Input() dataSource: any[] = [];
  @Input() placeholder: string;
  @Input() title: string;
  @Input() required: boolean;
  @Input() disabled: boolean;
  @Input() multiple: boolean;
  @Input() mensajeError : string;
  @Output() elementoSeleccionado = new EventEmitter();
  @Output() recargar = new EventEmitter();
  @HostBinding('class') @Input('class') classList: string;

  faSearchPlus = faSearchPlus;

  public elementosFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public elementosFiltrados: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  private readonly onDestroy: Subject<void> = new Subject<void>();

  // The internal data model
  private innerValue: any = '';

  // Placeholders for the callbacks which are later providesd
  // by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  constructor(public dialog: MatDialog) {
    this.placeholder = '';
    this.title = '';
    this.classList = '';
   }

  // get accessor
  get value(): any {
    return this.innerValue;
  }

  // set accessor including call the onchange callback
  // Si alguna vez necesito un chosen multiple, sacarle el v[0] dejarlo solo v ya que devuelve siempre array
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      setTimeout(() => this.onChangeCallback(v), 0);
    }
  }

  // Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  ngOnChanges(changes: SimpleChanges) {
    const dataSource = isNullOrUndefined(this.dataSource) ? [] : this.dataSource;
    this.inicilizarObserverElementoFilter(dataSource);
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  onChange() {
    this.elementoSeleccionado.emit(this.value);
  }

  recargarCombo() {
    this.recargar.emit(true);
  }

  inicilizarObserverElementoFilter(elemento: any[]) {

    this.elementosFiltrados.next(elemento.slice());
    this.elementosFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filtrarProductosCombo();
      });
  }

  compareObjects(o1: any, o2: any): boolean {
    if ((o1 !== undefined && o1 !== null) && (o2 !== undefined && o2 !== null)) {
      return o1.Descripcion === o2.Descripcion && o1.Id === o2.Id;
    }
    return false;
  }

  private filtrarProductosCombo() {
    if (!this.dataSource) {
      return;
    }

    let search = this.elementosFilterCtrl.value;
    if (!search) {
      this.elementosFiltrados.next(this.dataSource.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.elementosFiltrados.next(
      this.dataSource.filter(bank => bank.Descripcion.toLowerCase().indexOf(search) > -1)
    );
  }
}
