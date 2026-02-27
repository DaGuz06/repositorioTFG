import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
    id?: number;
    chef_id: number;
    user_id: number;
    text: string;
    rating: number;
    created_at?: string;
    user_name?: string;
    profile_picture?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private http = inject(HttpClient);
    private apiUrl = '/api/reviews';

    getReviewsByChef(chefId: number): Observable<Review[]> {
        return this.http.get<Review[]>(`${this.apiUrl}?chefId=${chefId}`);
    }

    addReview(review: Review): Observable<Review> {
        return this.http.post<Review>(this.apiUrl, {
            chefId: review.chef_id,
            userId: review.user_id,
            text: review.text,
            rating: review.rating
        });
    }
}
