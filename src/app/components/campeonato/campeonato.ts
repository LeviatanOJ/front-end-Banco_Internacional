import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Equipo {
  id: number;
  nombre: string;
  categoria_id: number;
  ciudad_id: number;
  fecha_inscripcion: string;
  Ciudad: {
    provincia: string;
    capital: string;
  };
  Categoria: {
    nombre: string;
  };
}

@Component({
  selector: 'app-campeonato',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './campeonato.html',
  styleUrl: './campeonato.css',
})
export class Campeonato implements OnInit {
  equipos: Equipo[] = [];
  cargando: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarEquipos();
  }

  cargarEquipos() {
    this.http.get<Equipo[]>('http://localhost:3000/api/equipos').subscribe({
      next: (response) => {
        this.equipos = response;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar equipos:', error);
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
    };

    return fechaObj.toLocaleDateString('es-ES', opciones);
  }

  obtenerClaseCategoria(categoria: string): string {
    switch (categoria.toLowerCase()) {
      case 'femenina':
        return 'femenina';
      case 'masculina':
        return 'masculina';
      case 'mixta':
        return 'mixta';
      default:
        return 'mixta';
    }
  }

  obtenerEquiposPorCategoria(categoria: string): Equipo[] {
    return this.equipos.filter(
      (equipo) =>
        equipo.Categoria.nombre.toLowerCase() === categoria.toLowerCase()
    );
  }

  obtenerEquiposPorProvincia(provincia: string): Equipo[] {
    return this.equipos.filter(
      (equipo) =>
        equipo.Ciudad.provincia.toLowerCase() === provincia.toLowerCase()
    );
  }

  obtenerEstadisticas() {
    return {
      totalEquipos: this.equipos.length,
      equiposFemeninos: this.obtenerEquiposPorCategoria('femenina').length,
      equiposMasculinos: this.obtenerEquiposPorCategoria('masculina').length,
      equiposMixtos: this.obtenerEquiposPorCategoria('mixta').length,
      provinciasParticipantes: [
        ...new Set(this.equipos.map((equipo) => equipo.Ciudad.provincia)),
      ].length,
    };
  }

  esInscripcionReciente(fecha: string): boolean {
    const fechaInscripcion = new Date(fecha + 'T00:00:00');
    const hoy = new Date();
    const diferenciaDias = Math.ceil(
      (hoy.getTime() - fechaInscripcion.getTime()) / (1000 * 3600 * 24)
    );

    return diferenciaDias <= 7;
  }
}
