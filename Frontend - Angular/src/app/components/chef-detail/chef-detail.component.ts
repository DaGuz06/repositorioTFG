import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChefService, ChefProfile } from '../../services/chef.service';
import { ReviewsComponent } from '../reviews/reviews.component';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-chef-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ReviewsComponent],
    templateUrl: './chef-detail.component.html',
    styleUrls: ['./chef-detail.component.css']
})
export class ChefDetailComponent implements OnInit {
    chef: ChefProfile | null = null;
    menus: any[] = [];
    loading = true;

    // Review form
    newReviewText = '';
    newReviewRating = 5;
    isSubmittingReview = false;

    private route = inject(ActivatedRoute);
    private chefService = inject(ChefService);
    private reviewService = inject(ReviewService);
    private authService = inject(AuthService);
    private router = inject(Router);

    ngOnInit() {
        this.route.params.subscribe(params => {
            const id = +params['id'];
            if (id) {
                this.loadChef(id);
                this.loadMenus(id);
            }
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

    submitReview() {
        if (!this.chef || !this.chef.id) return;

        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            alert('Debes iniciar sesión para dejar una reseña');
            this.router.navigate(['/login']);
            return;
        }

        if (!this.newReviewText.trim()) {
            alert('Por favor, escribe un comentario');
            return;
        }

        this.isSubmittingReview = true;
        this.reviewService.addReview({
            chef_id: this.chef.id,
            user_id: currentUser.id,
            text: this.newReviewText,
            rating: this.newReviewRating
        }).subscribe({
            next: () => {
                this.newReviewText = '';
                this.newReviewRating = 5;
                this.isSubmittingReview = false;
                if (this.chef && this.chef.id) {
                    this.loadChef(this.chef.id); // Reload chef to get new average rating
                }
                alert('Reseña añadida con éxito');
            },
            error: (err) => {
                console.error('Error adding review:', err);
                this.isSubmittingReview = false;
                alert('Error al añadir la reseña');
            }
        });
    }

    reserve() {
        if (this.chef && this.chef.id) {
            this.router.navigate(['/reservations'], { queryParams: { chefId: this.chef.id } });
        }
    }
}
