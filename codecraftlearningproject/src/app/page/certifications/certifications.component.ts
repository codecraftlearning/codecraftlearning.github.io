import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { FirebaseCollections } from '../../constants/commons.enum';
import { ICertificate } from '../../interfaces/certificate.interface';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-certifications',
  standalone: false,
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.scss'
})
export class CertificationsComponent implements OnInit {
  public loading: boolean = false;
  public certificateId: string = '';
  public certificate?: ICertificate;
  public error: string = '';
  public subscription: Subscription = new Subscription();

  constructor(private firebaseService: FirebaseService, private activatedRoute: ActivatedRoute) {
    // Initialize Firebase service if needed
  }

  public ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.certificateId = params['id'] || '';
      if (this.certificateId) {
        this.loadCertificate();
      }
    });
  }

  public loadCertificate(download: boolean = false) {
    if (this.certificateId) {
      this.loading = true;
      this.subscription.add(
        this.firebaseService.getFromCollectionById(FirebaseCollections.certificates, this.certificateId.trim())
          .subscribe((certificate: ICertificate | null) => {
            if (certificate) {
              this.certificate = certificate;
              this.error = '';
            } else {
              this.error = 'Certificate not found';
              this.certificate = undefined;
            }
            this.loading = false;
          }, error => {
            console.error('Error fetching certificate:', error);
            this.certificate = undefined;
            this.loading = false;
          })
      );
    }

    if (download) {
      this.downloadCertificate();
    }
  }

  private downloadCertificate() {
    const element = document.getElementById('capture-area');
    element?.classList.remove('hidden');
    if (!element) return;

    html2canvas(element, { backgroundColor: '#fff' }).then(canvas => {
      const jpgUrl = canvas.toDataURL('image/jpeg', 1);
      this.downloadImage(jpgUrl, 'certificate.jpg');
    });
  }

  private downloadImage(dataUrl: string, filename: string) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }
}
