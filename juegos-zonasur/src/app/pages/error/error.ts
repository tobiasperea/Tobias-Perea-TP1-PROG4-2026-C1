import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [CommonModule],
  templateUrl: './error.html',
  styleUrl: './error.css',
})
export class Error {

  constructor(private router: Router) { }

  
  volverHome() {
    this.router.navigate(['/home']);
  }
}
