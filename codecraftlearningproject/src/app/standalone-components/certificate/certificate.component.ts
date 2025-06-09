import { Component, Input } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import { ICertificate } from '../../interfaces/certificate.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [QRCodeComponent, CommonModule],
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.scss'
})
export class CertificateComponent {
  @Input() certificate?: ICertificate;

  public get certificateUrl(): string {
    return this.certificate ? `codecraftlearning.in/pages/certification?id=${this.certificate.id}` : '';
  }
}
