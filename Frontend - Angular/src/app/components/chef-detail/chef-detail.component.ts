import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';
import { ChefService, ChefProfile } from '../../services/chef.service';
import { ReviewsComponent } from '../reviews/reviews.component';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { ReservationService } from '../../services/reservation.service';

@Component({
    selector: 'app-chef-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ReviewsComponent, ImageUrlPipe],
    templateUrl: './chef-detail.component.html',
    styleUrls: ['./chef-detail.component.css']
})
export class ChefDetailComponent implements OnInit {
    @ViewChild(ReviewsComponent) reviewsComponent!: ReviewsComponent;

    chef: ChefProfile | null = null;
    menus: any[] = [];
    loading = true;
    canReview = false;
    hasReviewed = false;
    hasCompletedReservation = false;
    isOwnProfile = false;

    // Review form
    newReviewText = '';
    newReviewRating = 5;
    isSubmittingReview = false;

    // Feedback messages
    successMessage = '';
    errorMessage = '';

    private route = inject(ActivatedRoute);
    private chefService = inject(ChefService);
    private reviewService = inject(ReviewService);
    private authService = inject(AuthService);
    private reservationService = inject(ReservationService);
    private router = inject(Router);

    ngOnInit() {
        this.route.params.subscribe(params => {
            const id = +params['id'];
            if (id) {
                this.loadChef(id);
                this.loadMenus(id);
                this.checkReviewEligibility(id);
            }
        });
    }

    get currentUser() {
        return this.authService.getCurrentUser();
    }

    get isLoggedIn(): boolean {
        return !!this.currentUser;
    }

    checkReviewEligibility(chefId: number) {
        const user = this.currentUser;
        if (!user || !user.id) return;

        // Check if this is the chef's own profile
        this.isOwnProfile = Number(user.id) === Number(chefId);
        if (this.isOwnProfile) {
            this.canReview = false;
            return;
        }

        this.reservationService.checkCanReview(chefId, user.id).subscribe({
            next: (res) => {
                this.canReview = res.canReview;
                this.hasReviewed = res.hasReviewed;
                this.hasCompletedReservation = res.hasCompletedReservation;
            },
            error: (err) => console.error('Error checking review eligibility', err)
        });
    }

    loadChef(id: number) {
        this.chefService.getChefById(id).subscribe({
            next: (data) => this.chef = data,
            error: (err) => console.error('Error loading chef:', err)
        });
    }

    loadMenus(chefId: number) {
        this.chefService.getChefMenus(chefId).subscribe({
            next: (data) => {
                this.menus = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading menus:', err);
                this.loading = false;
            }
        });
    }

    getStarArray(rating: number): string[] {
        const stars: string[] = [];
        const fullStars = Math.floor(rating);
        const hasHalf = rating - fullStars >= 0.3 && rating - fullStars <= 0.7;
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) stars.push('full');
            else if (i === fullStars && hasHalf) stars.push('half');
            else stars.push('empty');
        }
        return stars;
    }

    submitReview() {
        if (!this.chef || !this.chef.id) return;

        const currentUser = this.currentUser;
        if (!currentUser) {
            this.router.navigate(['/login']);
            return;
        }

        if (!this.newReviewText.trim()) {
            this.errorMessage = 'Por favor, escribe un comentario.';
            return;
        }

        this.isSubmittingReview = true;
        this.errorMessage = '';
        this.successMessage = '';

        this.reviewService.addReview({
            chef_id: this.chef.id,
            user_id: currentUser.id,
            text: this.newReviewText,
            rating: this.newReviewRating
        }).subscribe({
            next: (res: any) => {
                this.newReviewText = '';
                this.newReviewRating = 5;
                this.isSubmittingReview = false;
                this.successMessage = '¡Reseña añadida con éxito! Gracias por tu opinión.';
                this.canReview = false;
                this.hasReviewed = true;

                // Update chef rating with the new average
                if (this.chef && res.avgRating !== undefined) {
                    this.chef.rating = res.avgRating;
                } else if (this.chef && this.chef.id) {
                    this.loadChef(this.chef.id);
                }

                // Reload the reviews list
                if (this.reviewsComponent) {
                    this.reviewsComponent.loadReviews();
                }

                setTimeout(() => this.successMessage = '', 5000);
            },
            error: (err) => {
                console.error('Error adding review:', err);
                this.isSubmittingReview = false;
                this.errorMessage = err.error?.message || 'Error al añadir la reseña.';
                setTimeout(() => this.errorMessage = '', 5000);
            }
        });
    }

    reserve() {
        if (this.chef && this.chef.id) {
            this.router.navigate(['/reservations'], { queryParams: { chefId: this.chef.id } });
        }
    }
}
