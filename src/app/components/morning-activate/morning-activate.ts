import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface EventoMorning {
  id: number;
  fecha: string;
  descripcion: string;
  ciudad: string;
}

@Component({
  selector: 'app-morning-activate',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './morning-activate.html',
  styleUrl: './morning-activate.css',
})
export class MorningActivate implements OnInit {
  eventos: EventoMorning[] = [];
  cargando: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarEventos();
  }

  cargarEventos() {
    this.http
      .get<EventoMorning[]>('http://localhost:3000/api/eventomanana')
      .subscribe({
        next: (response) => {
          this.eventos = response;
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar eventos:', error);
          this.cargando = false;
        },
      });
  }

  formatearFecha(fecha: string): string {
    const fechaObj = new Date(fecha + 'T00:00:00');
    const opciones: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    };

    return fechaObj.toLocaleDateString('es-ES', opciones);
  }

  esFechaProxima(fecha: string): boolean {
    const fechaEvento = new Date(fecha + 'T00:00:00');
    const hoy = new Date();
    const diferenciaDias = Math.ceil(
      (fechaEvento.getTime() - hoy.getTime()) / (1000 * 3600 * 24)
    );

    return diferenciaDias >= 0 && diferenciaDias <= 7;
  }

  obtenerEstadoEvento(fecha: string): string {
    const fechaEvento = new Date(fecha + 'T00:00:00');
    const hoy = new Date();

    if (fechaEvento < hoy) {
      return 'pasado';
    } else if (this.esFechaProxima(fecha)) {
      return 'proximo';
    } else {
      return 'futuro';
    }
  }
}
