import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  isModalOpen = false;
  // Esta propiedad almacenará la URL segura del video para el iframe
  videoUrlSafe: SafeResourceUrl | undefined;

  // Inyecta DomSanitizer en el constructor
  constructor(private router: Router, private sanitizer: DomSanitizer) {}

  irACampeonato() {
    this.router.navigate(['/campeonato']);
  }

  irAactivate() {
    this.router.navigate(['/manana-activate']);
  }
  irAClubes() {
    this.router.navigate(['/clubes']);
  }

  openVideoModal() {
    const youtubeEmbedUrl =
      'https://www.youtube.com/embed/gvlcil6hCLM?autoplay=1';

    // Sanitiza la URL para que Angular la considere segura para el iframe
    this.videoUrlSafe =
      this.sanitizer.bypassSecurityTrustResourceUrl(youtubeEmbedUrl);
    this.isModalOpen = true;
  }

  closeVideoModal() {
    this.isModalOpen = false;
    // Detiene la reproducción del video al cerrar el modal
    this.videoUrlSafe =
      this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
