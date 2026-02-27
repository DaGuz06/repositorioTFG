import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reservation {
    id?: number;
    name: string;
    street: string;
    contact_number: string;
    chef_id?: number;
    user_id?: number;
    status?: string;
    date: Date;
}

@Injectable({
    providedIn: 'root'
})
export class ReservationService {
    private apiUrl = '/api/reservations';

    constructor(private http: HttpClient) { }

    createReservation(reservation: Reservation): Observable<Reservation> {
        return this.http.post<Reservation>(this.apiUrl, reservation);
    }

    getReservationsByChef(chefId: number): Observable<Reservation[]> {
        return this.http.get<Reservation[]>(`${this.apiUrl}/chef/${chefId}`);
    }

    updateReservationStatus(reservationId: number, status: string): Observable<Reservation> {
        return this.http.patch<Reservation>(`${this.apiUrl}/${reservationId}/status`, { status });
    }

    checkCanReview(chefId: number, userId: number): Observable<{ canReview: boolean; hasCompletedReservation: boolean; hasReviewed: boolean }> {
        return this.http.get<{ canReview: boolean; hasCompletedReservation: boolean; hasReviewed: boolean }>(`${this.apiUrl}/can-review/${chefId}/${userId}`);
    }
}
