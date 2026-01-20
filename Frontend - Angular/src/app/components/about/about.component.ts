import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-container">
      <div class="content">
        <h1>Sobre Nosotros</h1>
        <p class="intro">
          Bienvenido a <strong>ChefPro</strong>, la plataforma que conecta a los amantes de la buena comida con los creadores de experiencias culinarias inolvidables.
        </p>

        <div class="grid">
          <div class="card">
            <h3>Nuestra Misión</h3>
            <p>Democratizar la alta cocina permitiendo que chefs talentosos compartan su arte directamente con comensales apasionados.</p>
          </div>
          <div class="card">
            <h3>Para Chefs</h3>
            <p>Ofrecemos una plataforma para mostrar tu talento, gestionar reservas y construir tu reputación culinaria sin los costes de un restaurante físico.</p>
          </div>
          <div class="card">
            <h3>Para Comensales</h3>
            <p>Descubre sabores únicos, menús exclusivos y la historia detrás de cada plato, todo desde la comodidad de tu hogar o en eventos privados.</p>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-container {
      padding: 4rem 2rem;
      background-color: white;
      min-height: 80vh;
    }
    .content {
      max-width: 1000px;
      margin: 0 auto;
      text-align: center;
    }
    h1 {
      font-size: 3rem;
      color: #333;
      margin-bottom: 2rem;
    }
    .intro {
      font-size: 1.4rem;
      color: #666;
      max-width: 800px;
      margin: 0 auto 4rem auto;
      line-height: 1.6;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    .card {
      background: #f9f9f9;
      padding: 2rem;
      border-radius: 10px;
      transition: transform 0.3s ease;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    h3 {
      color: #7A8A56;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    p {
      color: #555;
      line-height: 1.6;
    }
  `]
})
export class AboutComponent { }
