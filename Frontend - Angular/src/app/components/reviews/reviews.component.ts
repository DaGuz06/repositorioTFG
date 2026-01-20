import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
  reviews = [
    { name: 'Juan Pérez', comment: '¡Increíble servicio! Los chefs son de primera.', rating: 5, avatar: '/profileIcon.svg' },
    { name: 'Maria Garcia', comment: 'La comida estaba deliciosa. Repetiré seguro.', rating: 4, avatar: '/profileIcon.svg' },
    { name: 'Carlos López', comment: 'Una experiencia única.', rating: 5, avatar: '/profileIcon.svg' }
  ];
}
