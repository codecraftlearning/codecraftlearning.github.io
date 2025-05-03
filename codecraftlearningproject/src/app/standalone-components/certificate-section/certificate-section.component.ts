import { Component } from '@angular/core';
import { CertificateComponent } from '../certificate/certificate.component';

@Component({
  selector: 'app-certificate-section',
  standalone: true,
  imports: [CertificateComponent],
  templateUrl: './certificate-section.component.html',
  styleUrl: './certificate-section.component.scss'
})
export class CertificateSectionComponent {

}
