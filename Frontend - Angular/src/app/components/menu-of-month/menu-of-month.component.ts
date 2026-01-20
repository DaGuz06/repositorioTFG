import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-menu-of-month',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-container">
      <div class="menu-card">
        <h1>Menú del Mes</h1>
        <p class="subtitle">Una experiencia gastronómica curada por nuestros mejores chefs</p>
        
        <div class="menu-section">
          <h3>Entrantes</h3>
          <div class="menu-item">
            <span class="name">Carpaccio de Res con Trufa</span>
            <span class="price">18€</span>
          </div>
          <div class="menu-item">
            <span class="name">Burrata con Tomates Asados</span>
            <span class="price">15€</span>
          </div>
        </div>

        <div class="menu-section">
          <h3>Platos Principales</h3>
          <div class="menu-item">
            <span class="name">Risotto de Hongos Silvestres</span>
            <span class="price">24€</span>
          </div>
          <div class="menu-item">
            <span class="name">Salmón Glaseado con Miso</span>
            <span class="price">26€</span>
          </div>
        </div>

        <div class="menu-section">
          <h3>Postres</h3>
          <div class="menu-item">
            <span class="name">Tiramisú Clásico</span>
            <span class="price">9€</span>
          </div>
          <div class="menu-item">
            <span class="name">Coulant de Chocolate</span>
            <span class="price">9€</span>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-container {
      padding: 4rem 2rem;
      background-color: #f9f9f9;
      min-height: 80vh;
      display: flex;
      justify-content: center;
    }
    .menu-card {
      background: white;
      padding: 4rem;
      border: 1px solid #ddd;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      max-width: 700px;
      width: 100%;
      text-align: center;
      position: relative;
    }
    .menu-card::before {
      content: '';
      position: absolute;
      top: 10px; left: 10px; right: 10px; bottom: 10px;
      border: 2px solid #C7A446;
      pointer-events: none;
    }
    h1 {
      font-family: 'Playfair Display', serif;
      color: #333;
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      color: #7A8A56;
      font-style: italic;
      margin-bottom: 3rem;
    }
    .menu-section {
      margin-bottom: 3rem;
    }
    h3 {
      font-size: 1.5rem;
      color: #C7A446;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #eee;
      display: inline-block;
      padding-bottom: 0.5rem;
    }
    .menu-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }
    .name {
      color: #444;
    }
    .price {
      font-weight: 600;
      color: #333;
    }
  `]
})
export class MenuOfMonthComponent { }
