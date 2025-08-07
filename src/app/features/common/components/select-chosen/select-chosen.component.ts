import {
  Component,
  Output,
  EventEmitter,
  forwardRef,
  HostBinding,
} from '@angular/core';
import { Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormsModule, ControlValueAccessor } from '@angular/forms';
import { CustomMaterialModule } from '../../material/custom-material.module';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { Select } from "primeng/select";
import { FloatLabel } from 'primeng/floatlabel';

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
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,],
  imports: [CustomMaterialModule, CommonModule,
    FormsModule,
    DropdownModule,
    MultiSelectModule,
    ButtonModule,
    MessageModule, Select, FloatLabel]
})
export class SelectChosenComponent implements ControlValueAccessor {
  @Input() dataSource: any[] = [];
  @Input() placeholder: string = '';
  @Input() title: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() multiple: boolean = false;
  @Input() mensajeError: string = '';
  @Input('class') @HostBinding('class') classList: string = '';

  @Output() elementoSeleccionado = new EventEmitter<any>();
  @Output() recargar = new EventEmitter<void>();

  value: any;
  onChangeFn: (value: any) => void = () => { };
  onTouchedFn: () => void = () => { };

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onValueChange(value: any): void {
    this.value = value;
    this.onChangeFn(value);
    this.elementoSeleccionado.emit(value);
  }

  recargarCombo() {
    this.recargar.emit();
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1?.Id === o2?.Id;
  }
}
