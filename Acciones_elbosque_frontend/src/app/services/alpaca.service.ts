import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
export interface PortfolioSnapshot {
  equity: number;
  cash: number;
  buying_power: number;
  daily_change: number;
  historical_equity: {
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
}

export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api/alpaca'  // ← añade /alpaca
}
import {
  AccountBalance,
  AlpacaAsset,
  AlpacaQuote,
  AlpacaPosition,
  CandleData
} from '../models/alpaca';

@Injectable({ providedIn: 'root' })
export class AlpacaService {

  private readonly base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getBalance(): Observable<AccountBalance> {
    return this.http.get<AccountBalance>(`${this.base}/balance`)
      .pipe(catchError(this.handle));
  }

  getAssets(): Observable<AlpacaAsset[]> {
    return this.http.get<AlpacaAsset[]>(`${this.base}/assets`)
      .pipe(catchError(this.handle));
  }
getAvailableAssets(): Observable<AlpacaAsset[]> {
  return this.http.get<AlpacaAsset[]>(`${this.base}/assets`)
    .pipe(catchError(this.handle));
}

  getQuote(symbol: string): Observable<AlpacaQuote> {
    return this.http.get<AlpacaQuote>(`${this.base}/quote/${symbol}`)
      .pipe(catchError(this.handle));
  }

 getPositions(): Observable<any[]> {
  return this.http.get(`${this.base}/positions`, { responseType: 'text' })
    .pipe(
      map(response => JSON.parse(response)), // parsea manualmente el JSON
      catchError(this.handle)
    );
}

getClosedPositions(): Observable<any[]> {
  return this.http.get<any[]>(`${this.base}/operaciones-ejecutadas`)
    .pipe(catchError(this.handle));
}
  // ————————————————————————————
  private handle(error: HttpErrorResponse) {
    console.error('[AlpacaService]', error);
    return throwError(() =>
      new Error(error.error?.message || 'Error al consultar la API de Alpaca')
    );
  }

  getHistoricalData(symbol: string, timeFrame: string, start: string, end: string): Observable<CandleData[]> {
  const params = { start, end };
  return this.http.get<CandleData[]>(`${this.base}/historical/${symbol}/${timeFrame}`, { params })
    .pipe(catchError(this.handle));
}

  placeMarketOrder(symbol: string, qty: number, side: 'buy' | 'sell',idUsuario: number): Observable<string> {
    const params = {
      symbol,
      qty,
      side,
      idUsuario
    };
    return this.http.post(`http://localhost:8080/api/orders/market`, null, { params, responseType: 'text' })
      .pipe(catchError(this.handle));
  }

  placeMarketOrderSell(symbol: string, qty: number, side: 'buy' | 'sell', idUsuario: number , time:string): Observable<string> {
    const params = {
      symbol,
      qty,
      side,
      idUsuario,
      time
    };
    return this.http.post(`http://localhost:8080/api/orders/market/sell`, null, { params, responseType: 'text' })
      .pipe(catchError(this.handle));
  }

getPortfolioSnapshot(): Observable<PortfolioSnapshot> {
  return this.http.get<PortfolioSnapshot>('http://localhost:8080/api/alpaca/portfolio-snapshot');
}
}


