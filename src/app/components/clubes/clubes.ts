import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Club {
  id: number;
  nombre: string;
  lugar: string;
  dias: string;
  horario: string;
  ciudad: string;
  modalidad: string;
}

@Component({
  selector: 'app-clubes',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './clubes.html',
  styleUrl: './clubes.css',
})
export class Clubes implements OnInit {
  clubes: Club[] = [];
  cargando: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarClubes();
  }

  cargarClubes() {
    this.http.get<Club[]>('http://localhost:3000/api/clubes').subscribe({
      next: (response) => {
        this.clubes = response;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar clubes:', error);
        this.cargando = false;
      },
    });
  }

  obtenerIconoClub(nombre: string): string {
    switch (nombre.toLowerCase()) {
      case 'yoga':
        return '🧘‍♀️';
      case 'running':
        return '🏃‍♂️';
      case 'lectura':
        return '📚';
      default:
        return '⭐';
    }
  }

  obtenerColorModalidad(modalidad: string): string {
    switch (modalidad.toLowerCase()) {
      case 'virtual':
        return '#28a745';
      case 'presencial':
        return '#007bff';
      case 'híbrido':
        return '#fd7e14';
      default:
        return '#6c757d';
    }
  }
}
