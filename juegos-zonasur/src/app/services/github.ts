import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Github {

  constructor(private http: HttpClient) {}

  obtenerUsuario(user: string) {
    return this.http.get(`https://api.github.com/users/${user}`);
  }
}