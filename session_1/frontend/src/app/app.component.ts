import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <h1>Welcome to {{title}}!</h1>
    <div class="content">
      <h2>Workshop TODO App</h2>
      <div class="health-check">
        <p>Backend Status: <span [ngClass]="healthStatus">{{healthMessage}}</span></p>
        <button (click)="checkHealth()">Check Backend Health</button>
      </div>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    h1 {
      color: #369;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 250%;
    }
    h2 {
      color: #444;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: lighter;
    }
    .content {
      padding: 20px;
    }
    .health-check {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .healthy {
      color: green;
      font-weight: bold;
    }
    .unhealthy {
      color: red;
      font-weight: bold;
    }
    button {
      background-color: #1976d2;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 3px;
      cursor: pointer;
    }
    button:hover {
      background-color: #0d47a1;
    }
  `]
})
export class AppComponent {
  title = 'Workshop Frontend';
  healthStatus = '';
  healthMessage = 'Not checked';

  async checkHealth() {
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        const data = await response.json();
        this.healthStatus = 'healthy';
        this.healthMessage = '🚀 Backend Connected 🚀';
      } else {
        this.healthStatus = 'unhealthy';
        this.healthMessage = '⚠️ Backend Error';
      }
    } catch (error) {
      this.healthStatus = 'unhealthy';
      this.healthMessage = '💀 Backend Offline';
    }
  }
}