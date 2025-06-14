import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    HttpClientModule,
    FormsModule,
    RouterLinkActive,
    CommonModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  // Variables para el login
  correo: string = '';
  password: string = '';
  modalAbierto: boolean = false;

  // Variables para el estado del usuario
  usuarioLogueado: boolean = false;
  nombreUsuario: string = '';
  userMenuAbierto: boolean = false;
  datosUsuario: any = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Verificar si hay un usuario logueado al cargar el componente
    this.verificarSesionExistente();
  }

  // Verificar si existe una sesión guardada
  verificarSesionExistente() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const usuario = localStorage.getItem('usuario');

      if (token && usuario) {
        try {
          this.datosUsuario = JSON.parse(usuario);
          this.usuarioLogueado = true;
          this.nombreUsuario = this.obtenerNombreCompleto(this.datosUsuario);
        } catch (error) {
          console.error('Error al parsear datos de usuario:', error);
          this.limpiarSesion();
        }
      }
    }
  }

  // Obtener nombre completo del usuario
  obtenerNombreCompleto(usuario: any): string {
    if (usuario.nombre && usuario.apellido) {
      return `${usuario.nombre} ${usuario.apellido}`;
    } else if (usuario.nombre) {
      return usuario.nombre;
    } else if (usuario.correo) {
      return usuario.correo.split('@')[0]; // Usar parte del email como nombre
    }
    return 'Usuario';
  }

  // Abrir modal de login
  abrirModal() {
    this.modalAbierto = true;
  }

  // Cerrar modal de login
  cerrarModal() {
    this.modalAbierto = false;
    this.limpiarFormulario();
  }

  // Limpiar formulario de login
  limpiarFormulario() {
    this.correo = '';
    this.password = '';
  }

  // Función de login
  login() {
    const body = {
      correo: this.correo,
      password: this.password,
    };

    this.http
      .post<any>(
        'https://back-en-banco-internacional-570363792827.europe-west1.run.app/api/auth/login',
        body
      )
      .subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
          const token = response.token;
          const usuario = response.data.participante;

          // Guardar datos en localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('usuario', JSON.stringify(usuario));

          // Actualizar estado del componente
          this.datosUsuario = usuario;
          this.usuarioLogueado = true;
          this.nombreUsuario = this.obtenerNombreCompleto(usuario);

          // Cerrar modal y limpiar formulario
          this.cerrarModal();

          console.log('Usuario logueado:', this.nombreUsuario);
        },
        error: (error) => {
          console.error('Error en el login:', error);
          alert('Credenciales incorrectas o error en el servidor.');
        },
      });
  }

  // Alternar menú de usuario
  toggleUserMenu() {
    this.userMenuAbierto = !this.userMenuAbierto;
  }

  // Cerrar menú de usuario (útil para clics fuera del menú)
  cerrarUserMenu() {
    this.userMenuAbierto = false;
  }

  menuMovilAbierto: boolean = false; // << nueva variable para menú móvil

  // Nuevo método para toggle menú móvil
  toggleMenuMovil() {
    this.menuMovilAbierto = !this.menuMovilAbierto;
    this.cerrarUserMenu(); // opcional, cerrar menú usuario si estaba abierto
  }
  // Función de logout
  logout() {
    // Limpiar localStorage
    this.limpiarSesion();

    // Resetear estado del componente
    this.usuarioLogueado = false;
    this.nombreUsuario = '';
    this.datosUsuario = null;
    this.userMenuAbierto = false;

    console.log('Sesión cerrada');

    // Opcional: Redireccionar a página de inicio
    // this.router.navigate(['/']);
  }

  // Limpiar datos de sesión
  limpiarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  // Obtener iniciales del usuario para el avatar
  obtenerIniciales(): string {
    if (!this.nombreUsuario) return 'U';

    const nombres = this.nombreUsuario.split(' ');
    if (nombres.length >= 2) {
      return (nombres[0].charAt(0) + nombres[1].charAt(0)).toUpperCase();
    }
    return this.nombreUsuario.charAt(0).toUpperCase();
  }

  // Funciones adicionales para el menú de usuario
  irAPerfil() {
    this.cerrarUserMenu();
    // Lógica para ir al perfil
    console.log('Ir a perfil');
  }

  iraConfiguracion() {
    this.cerrarUserMenu();
    // Lógica para ir a configuración
    console.log('Ir a configuración');
  }
}
