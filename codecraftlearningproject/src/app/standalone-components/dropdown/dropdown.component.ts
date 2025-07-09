import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef, HostListener, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements ControlValueAccessor {
  @Input()
  public items: any[] = [];

  @Input()
  public multiselect: boolean = false;

  @Input()
  public labelKey: string = '';

  @Input()
  public valueKey: string = '';

  public isOpen: boolean = false;

  public selectedItems: any[] = [];

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  public toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  public getLabel(item: any): string {
    if (this.labelKey) {
      return item[this.labelKey];
    }
    return item;
  }

  public getValue(item: any): string {
    if (this.valueKey) {
      return item[this.valueKey];
    }
    return item;
  }

  public isSelected(item: any): boolean {
    if (this.multiselect) {
      return this.selectedItems.includes(this.getValue(item));
    }
    return this.selectedItems[0] === this.getValue(item);
  }

  public getPlaceholder(): string {
    if (this.multiselect) { 
      return this.selectedItems.length > 0
        ? this.selectedItems.length + ' selected'
        : 'Select from the list';
    }
    return this.selectedItems.length > 0
      ? this.getLabel(this.selectedItems[0])
      : 'Select an item';
  }

  public selectItem(item: any): void {
    const index = this.selectedItems.indexOf(this.getValue(item));
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(this.getValue(item));
    }
    if (!this.multiselect) {
      this.isOpen = false;
    }
    this.onChange(this.selectedItems);
  }

  public writeValue(value: any): void {
    this.selectedItems = value || [];
  }

  public registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    // Optional: Handle disabled state if needed
  }
}
