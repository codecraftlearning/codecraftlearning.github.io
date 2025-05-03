import { Component } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [QRCodeComponent],
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.scss'
})
export class CertificateComponent {

}
