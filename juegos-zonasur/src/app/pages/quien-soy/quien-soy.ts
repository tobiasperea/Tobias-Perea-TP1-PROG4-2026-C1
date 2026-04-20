import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Github } from '../../services/github';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quien-soy.html',
  styleUrls: ['./quien-soy.css']
})
export class QuienSoy {

  usuario$!: Observable<any>;

  constructor(private github: Github) {}

  ngOnInit() {
    this.usuario$ = this.github.obtenerUsuario('tobiasperea');
  }

  irAGithub(url: string) {
    window.open(url, '_blank');
  }
}