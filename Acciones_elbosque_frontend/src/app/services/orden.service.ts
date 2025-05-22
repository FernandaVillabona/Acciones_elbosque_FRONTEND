import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = 'http://localhost:8080/api/orders'; // ajusta si usas proxy o dominio diferente

  constructor(private http: HttpClient) {}

  placeMarketOrder(symbol: string, qty: number, side: 'buy' | 'sell'): Observable<any> {
    const params = new HttpParams()
      .set('symbol', symbol)
      .set('qty', qty.toString())
      .set('side', side);
    return this.http.post(`${this.baseUrl}/market`, null, { params });
  }

  placeLimitOrder(symbol: string, qty: number, price: number): Observable<any> {
    const params = new HttpParams()
      .set('symbol', symbol)
      .set('qty', qty.toString())
      .set('price', price.toString());
    return this.http.post(`${this.baseUrl}/limit`, null, { params });
  }

  placeStopLossOrder(symbol: string, qty: number, side: 'buy' | 'sell', stopPrice: number): Observable<any> {
    const params = new HttpParams()
      .set('symbol', symbol)
      .set('qty', qty.toString())
      .set('side', side)
      .set('stopPrice', stopPrice.toString());
    return this.http.post(`${this.baseUrl}/stoploss`, null, { params });
  }

  placeTakeProfitOrder(symbol: string, qty: number, side: 'buy' | 'sell', limitPrice: number): Observable<any> {
    const params = new HttpParams()
      .set('symbol', symbol)
      .set('qty', qty.toString())
      .set('side', side)
      .set('limitPrice', limitPrice.toString());
    return this.http.post(`${this.baseUrl}/takeprofit`, null, { params });
  }

  cancelOrder(orderId: string): Observable<any> {
  return this.http.delete(`http://localhost:8080/api/orders/${orderId}`);
}
}