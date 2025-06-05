import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

interface Club {
  id: number;
  nombre: string;
  lugar: string;
  dias: string;
  horario: string;
  ciudad: string;
  modalidad: string;
}

interface Inscrito {
  participante: string;
  correo: string;
  club: string;
  rol: string;
}

interface Participante {
  id: number;
  nombre: string;
  correo: string;
}

interface InscripcionRequest {
  participante_id: number;
  club_id: number;
  rol_id: number;
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
  inscritos: Inscrito[] = [];
  cargando: boolean = true;
  participante: Participante | null = null;

  inscribiendo: boolean = false;
  clubInscribiendoId: number | null = null;

  mostrarSelectorRol: { [clubId: number]: boolean } = {}; // Nuevo
  rolSeleccionadoPorClub: { [clubId: number]: number } = {}; // Opcional

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarDatosParticipante();
    this.cargarClubes();
    this.cargarInscritos();
  }

  cargarDatosParticipante() {
    if (!isPlatformBrowser(this.platformId)) return;

    const usuarioRaw = localStorage.getItem('usuario');
    if (usuarioRaw) {
      try {
        this.participante = JSON.parse(usuarioRaw);
        console.log(
          'Participante cargado desde localStorage:',
          this.participante
        );
      } catch (error) {
        console.error('Error al parsear datos de usuario:', error);
        this.participante = null;
      }
    } else {
      console.log('No se encontraron datos del participante en localStorage');
    }
  }

  cargarClubes() {
    this.http
      .get<Club[]>(
        'https://back-en-banco-internacional-570363792827.europe-west1.run.app/api/clubes'
      )
      .subscribe({
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

  async inscribirseAlClub(clubId: number, rol_id: number) {
    if (!this.participante) {
      alert('Debes iniciar sesión para inscribirte a un club');
      return;
    }

    if (this.inscribiendo) return;

    const club = this.clubes.find((c) => c.id === clubId);
    if (!club) {
      alert('Club no encontrado');
      return;
    }

    this.inscribiendo = true;
    this.clubInscribiendoId = clubId;

    const inscripcionData: InscripcionRequest = {
      participante_id: this.participante.id,
      club_id: clubId,
      rol_id: rol_id,
    };

    try {
      if (!isPlatformBrowser(this.platformId)) {
        throw new Error('No se puede acceder a localStorage en el servidor');
      }

      const token = localStorage.getItem('token');

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      });

      const response = await this.http
        .post<any>(
          'https://back-en-banco-internacional-570363792827.europe-west1.run.app/api/inscribirclub',
          inscripcionData,
          {
            headers,
          }
        )
        .toPromise();

      console.log('Respuesta de inscripción:', response);

      if (response) {
        alert(
          `¡Te has inscrito como ${
            rol_id === 1 ? 'Coach' : 'Participante'
          } en "${club.nombre}"!`
        );
        this.mostrarSelectorRol[clubId] = false;
      } else {
        throw new Error('Respuesta vacía del servidor');
      }
    } catch (error: any) {
      console.error('Error al inscribirse al club:', error);
      let mensajeError = 'Error al inscribirse al club. ';

      if (error.status === 400) {
        mensajeError += 'Datos inválidos o ya estás inscrito en este club.';
      } else if (error.status === 401) {
        mensajeError += 'Tu sesión ha expirado. Inicia sesión nuevamente.';
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('usuario');
          localStorage.removeItem('token');
        }
        this.participante = null;
      } else if (error.status === 404) {
        mensajeError += 'Club no encontrado.';
      } else if (error.status >= 500) {
        mensajeError += 'Error del servidor. Intenta nuevamente más tarde.';
      } else {
        mensajeError +=
          error.error?.message || error.message || 'Intenta nuevamente.';
      }

      alert(mensajeError);
    } finally {
      this.inscribiendo = false;
      this.clubInscribiendoId = null;
    }
  }

  estaInscribiendoClub(clubId: number): boolean {
    return this.inscribiendo && this.clubInscribiendoId === clubId;
  }

  estaLogueado(): boolean {
    return this.participante !== null;
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

  cargarInscritos() {
    this.http
      .get<Inscrito[]>(
        'https://back-en-banco-internacional-570363792827.europe-west1.run.app/api/inscritosclub'
      )
      .subscribe({
        next: (response) => {
          this.inscritos = response;
        },
        error: (error) => {
          console.error('Error al cargar inscritos:', error);
        },
      });
  }

  obtenerColorRol(rol: string): string {
    return rol.toLowerCase() === 'coach' ? '#e83e8c' : '#17a2b8'; // rosa para coach, azul para participante
  }
}
