import { Component, signal } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';
import { Chat } from './components/chat/chat';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink, Chat],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
 
}
