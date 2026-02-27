import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService, Review } from '../../services/review.service';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, ImageUrlPipe],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  @Input() chefId!: number;
  private reviewService = inject(ReviewService);

  reviews: Review[] = [];

  ngOnInit() {
    if (this.chefId) {
      this.loadReviews();
    } else {
      // Hardcoded reviews for the Home page
      this.reviews = [
        {
          chef_id: 0,
          user_id: 101,
          user_name: 'María García',
          text: 'Una experiencia culinaria inolvidable. Los sabores estaban perfectos y la presentación fue impecable.',
          rating: 5,
          profile_picture: ''
        },
        {
          chef_id: 0,
          user_id: 102,
          user_name: 'Carlos Rodríguez',
          text: 'Muy buen servicio y comida deliciosa. Sin duda volveremos a repetir para nuestro próximo evento.',
          rating: 5,
          profile_picture: ''
        },
        {
          chef_id: 0,
          user_id: 103,
          user_name: 'Laura Méndez',
          text: 'El chef fue muy profesional y educado. Platos ricos, aunque la carne estaba un poco pasada para mi gusto.',
          rating: 4,
          profile_picture: ''
        }
      ];
    }
  }

  loadReviews() {
    this.reviewService.getReviewsByChef(this.chefId).subscribe({
      next: (data) => this.reviews = data,
      error: (err) => console.error('Error loading reviews:', err)
    });
  }
}
