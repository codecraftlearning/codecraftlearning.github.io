import { Component } from '@angular/core';
import { CertificateComponent } from '../certificate/certificate.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-certificate-section',
  standalone: true,
  imports: [CertificateComponent, RouterModule],
  templateUrl: './certificate-section.component.html',
  styleUrl: './certificate-section.component.scss'
})
export class CertificateSectionComponent {

}
