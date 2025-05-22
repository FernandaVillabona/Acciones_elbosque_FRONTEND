import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
declare var bootstrap: any;
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-modal-compra',
  templateUrl: './modal-compra.component.html',
  styleUrls: ['./modal-compra.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ModalCompraComponent {
  @Input() symbol: string = '';
@Output() confirmar = new EventEmitter<{
  symbol: string;
  qty: number;
  side: 'buy';
  type: 'market' | 'limit' | 'stop' | 'take_profit';
  targetPrice?: number | null;
}>();

  @ViewChild('modalCompra') modalRef!: ElementRef;
  cantidad: number = 1;

  orderType: 'market' | 'limit' | 'stop' | 'take_profit' = 'market';
targetPrice: number | null = null;

  open(): void {
    if (this.modalRef?.nativeElement) {
      new bootstrap.Modal(this.modalRef.nativeElement).show();
    }
  }

  close(): void {
    if (this.modalRef?.nativeElement) {
      bootstrap.Modal.getInstance(this.modalRef.nativeElement)?.hide();
    }
  }

confirmarOrden(): void {
  if (this.cantidad < 1) {
    alert('Cantidad inválida');
    return;
  }

  this.confirmar.emit({
    symbol: this.symbol,
    qty: this.cantidad,
    side: 'buy',
    type: this.orderType,
    targetPrice: this.orderType === 'market' ? null : this.targetPrice
  });

  this.close();
}

 

}
