import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePackageComponent } from './course-package.component';

describe('CoursePackageComponent', () => {
  let component: CoursePackageComponent;
  let fixture: ComponentFixture<CoursePackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursePackageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursePackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
