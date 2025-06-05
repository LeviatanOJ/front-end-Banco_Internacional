import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface EventoMorning {
  id: number;
  fecha: string;
  descripcion: string;
  ciudad: string;
}

interface Participante {
  id: number;
  nombre: string;
  correo: string;
}

interface InscripcionEventoRequest {
  participante_id: number;
  evento_id: number;
}

interface InscritoEvento {
  participante: string;
  correo: string;
  evento: string;
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

  participante: Participante | null = null;
  inscribiendo: boolean = false;
  eventoInscribiendoId: number | null = null;
  inscritos: InscritoEvento[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarDatosParticipante();
    this.cargarEventos();
    this.cargarInscritos();
  }

  cargarEventos() {
    this.http
      .get<EventoMorning[]>(
        'https://back-en-banco-internacional-570363792827.europe-west1.run.app/api/eventomanana'
      )
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

  cargarDatosParticipante() {
    const usuarioRaw = localStorage.getItem('usuario');
    if (usuarioRaw) {
      try {
        this.participante = JSON.parse(usuarioRaw);
      } catch (error) {
        console.error('Error al parsear datos del participante:', error);
      }
    }
  }

  inscribirseAlEvento(eventoId: number) {
    if (!this.participante) {
      alert('Debes iniciar sesión para participar en un evento.');
      return;
    }

    this.inscribiendo = true;
    this.eventoInscribiendoId = eventoId;

    const payload: InscripcionEventoRequest = {
      participante_id: this.participante.id,
      evento_id: eventoId,
    };

    this.http
      .post('http://localhost:8080/api/inscribirEvento', payload)
      .subscribe({
        next: () => {
          alert('¡Inscripción exitosa al evento!');
          this.cargarInscritos();
        },
        error: (err) => {
          console.error('Error al inscribirse al evento:', err);
          alert('No se pudo completar la inscripción.');
        },
        complete: () => {
          this.inscribiendo = false;
          this.eventoInscribiendoId = null;
        },
      });
  }

  cargarInscritos() {
    this.http
      .get<InscritoEvento[]>('http://localhost:8080/api/participacionesEvento')
      .subscribe({
        next: (res) => (this.inscritos = res),
        error: (err) => console.error('Error al cargar inscritos:', err),
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
