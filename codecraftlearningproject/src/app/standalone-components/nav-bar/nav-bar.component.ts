import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  public navItems = [
    { name: 'About', path: '/home', type: 'link', fragment: ''  },
    { name: 'Courses', path: '/courses', type: 'link', fragment: ''  },
    { name: 'Testimonials', path: '/testimonials', type: 'link', fragment: ''  },
    { name: 'Certification', path: '/certification', type: 'link', fragment: ''  },
    { name: 'Contact', path: '', type: 'fragment', fragment: 'contact' },
    { name: 'Enroll Now', handler: () => {}, type: 'button' },
  ]

  public scrollTo(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
