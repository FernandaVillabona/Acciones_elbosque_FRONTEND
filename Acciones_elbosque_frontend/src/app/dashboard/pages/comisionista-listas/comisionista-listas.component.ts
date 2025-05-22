import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AlpacaService} from '../../../services/alpaca.service';

@Component({
  selector: 'app-comisionista-listas',
  imports: [],
  templateUrl: './comisionista-listas.component.html',
  standalone: true,
  styleUrl: './comisionista-listas.component.css'
})
export class ComisionistaListasComponent {

  constructor(private http: HttpClient ,private alpaca: AlpacaService) {}




}
