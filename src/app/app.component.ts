import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {  RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink], // 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'threejs-with-angular';
}
