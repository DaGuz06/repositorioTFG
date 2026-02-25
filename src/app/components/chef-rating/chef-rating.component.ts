import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-chef-rating',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chef-rating.component.html',
    styleUrls: ['./chef-rating.component.css']
})
export class ChefRatingComponent {
    @Input() chefId!: number;
    @Output() ratingSubmitted = new EventEmitter<{ rating: number; comment: string }>();

    rating: number = 0;
    hoverRating: number = 0;
    comment: string = '';

    setRating(value: number) {
        this.rating = value;
    }

    onHover(value: number) {
        this.hoverRating = value;
    }

    submitRating() {
        if (this.rating === 0) {
            alert('Por favor, selecciona una valoración.');
            return;
        }
        this.ratingSubmitted.emit({
            rating: this.rating,
            comment: this.comment
        });
        // Reset form
        this.rating = 0;
        this.comment = '';
    }
}
