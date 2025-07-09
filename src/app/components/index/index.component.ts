import { Component } from '@angular/core';
import { NavbarComponent } from "./navbar/navbar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-index',
  imports: [
    NavbarComponent,
    RouterOutlet
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})

export default class IndexComponent {

}
