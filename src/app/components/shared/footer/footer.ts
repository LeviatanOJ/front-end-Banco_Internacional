import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit {
  currentYear: number = new Date().getFullYear();
  appVersion: string = '2.1.4'; // Versión de la aplicación interna

  constructor() {}

  ngOnInit(): void {
    // Inicialización del componente
  }

  // Método para abrir soporte IT
  abrirSoporte(): void {
    // Redirigir a sistema de tickets interno o abrir chat
    console.log('Abriendo soporte IT...');
    // Ejemplo: window.open('https://soporte-interno.bancointernacional.com', '_blank');
  }

  // Método para reportar problemas
  reportarProblema(): void {
    // Abrir formulario de reporte de bugs/issues
    console.log('Abriendo formulario de reporte...');
    // Ejemplo: abrir modal de reporte o redirigir a sistema de tickets
  }

  // Método para manejar clics en información de contacto interno
  onContactClick(contactType: string, value: string): void {
    switch (contactType) {
      case 'email':
        window.location.href = `mailto:${value}`;
        break;
      case 'phone':
        // Para extensiones internas, podrías mostrar un modal con instrucciones
        console.log(`Marcar extensión: ${value}`);
        alert(`Para contactar soporte, marca la extensión: ${value}`);
        break;
      case 'extension':
        console.log(`Extensión: ${value}`);
        break;
      default:
        console.log(`Contacto interno: ${contactType} - ${value}`);
    }
  }

  // Método para manejar recursos internos
  onResourceClick(resource: string): void {
    console.log(`Abriendo recurso: ${resource}`);

    // URLs de recursos internos (reemplaza con las URLs reales)
    const internalResources: { [key: string]: string } = {
      manual: '/assets/docs/manual-usuario.pdf',
      reglamento: '/assets/docs/reglamento-deportivo.pdf',
      calendario: '/calendario-eventos',
      rrhh: 'https://portal-rrhh.bancointernacional.com',
    };

    if (internalResources[resource]) {
      if (resource === 'rrhh') {
        window.open(internalResources[resource], '_blank');
      } else {
        // Para recursos internos, navegar dentro de la app
        window.open(internalResources[resource], '_blank');
      }
    }
  }

  // Método para manejar políticas internas
  onPolicyClick(policy: string): void {
    console.log(`Abriendo política: ${policy}`);

    switch (policy) {
      case 'uso-interno':
        // Abrir modal o página con política de uso interno
        break;
      case 'seguridad-it':
        // Abrir página de políticas de seguridad IT
        break;
      case 'version':
        // Mostrar información de la versión
        this.mostrarInfoVersion();
        break;
      default:
        console.log(`Política no encontrada: ${policy}`);
    }
  }

  // Método para mostrar información de versión
  mostrarInfoVersion(): void {
    const fechaVersion = '15/05/2024';
    const cambios = [
      '• Mejoras en el sistema de campeonatos',
      '• Nueva sección de Mañana Actívate',
      '• Optimizaciones de rendimiento',
      '• Corrección de bugs reportados',
    ];

    alert(
      `Versión ${
        this.appVersion
      }\nFecha: ${fechaVersion}\n\nCambios recientes:\n${cambios.join('\n')}`
    );
  }

  // Método para navegación interna
  onNavigationClick(route: string): void {
    console.log(`Navegando a: ${route}`);
    // La navegación real se maneja con routerLink en el template
  }

  // Método para obtener el año actual
  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  // Método para scroll hacia arriba
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
