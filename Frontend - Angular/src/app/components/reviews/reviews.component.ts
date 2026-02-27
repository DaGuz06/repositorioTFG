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
    }
  }

  loadReviews() {
    this.reviewService.getReviewsByChef(this.chefId).subscribe({
      next: (data) => this.reviews = data,
      error: (err) => console.error('Error loading reviews:', err)
    });
  }
}
