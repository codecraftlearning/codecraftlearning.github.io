import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateSectionComponent } from './certificate-section.component';

describe('CertificateSectionComponent', () => {
  let component: CertificateSectionComponent;
  let fixture: ComponentFixture<CertificateSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
