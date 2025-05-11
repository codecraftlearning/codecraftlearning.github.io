import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-technology',
  standalone: true,
  imports: [],
  templateUrl: './technology.component.html',
  styleUrl: './technology.component.scss'
})
export class TechnologyComponent {

  public technologiesImages: string[][] = [
    [
      'assets/tech-images/angular.png',
      'assets/tech-images/cicd.png',
      'assets/tech-images/css.png',
      'assets/tech-images/design-pattern.png',
      'assets/tech-images/docker.png',
      'assets/tech-images/express.png'
    ],
    [
      'assets/tech-images/git.png',
      'assets/tech-images/html.png',
      'assets/tech-images/java.png',
      'assets/tech-images/js.png',
      'assets/tech-images/kubernetes.png',
      'assets/tech-images/microservices.png'
    ],
    [
      'assets/tech-images/nodejs.png',
      'assets/tech-images/nosql.png',
      'assets/tech-images/os.png',
      'assets/tech-images/python.png',
      'assets/tech-images/react.png',
      'assets/tech-images/spring-boot.png'
    ]
  ];
}
