import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reservation {
    id?: number;
    name: string;
    street: string;
    contact_number: string;
    chef_id?: number;
    date: Date;
}

@Injectable({
    providedIn: 'root'
})
export class ReservationService {
    private apiUrl = 'http://localhost:3000/api/reservations';

    constructor(private http: HttpClient) { }

    createReservation(reservation: Reservation): Observable<Reservation> {
        return this.http.post<Reservation>(this.apiUrl, reservation);
    }
}
