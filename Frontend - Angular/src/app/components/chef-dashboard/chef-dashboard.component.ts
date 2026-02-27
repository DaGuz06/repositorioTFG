import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReservationService, Reservation } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-chef-dashboard',
    standalone: true,
    imports: [CommonModule, DatePipe],
    templateUrl: './chef-dashboard.component.html',
    styleUrls: ['./chef-dashboard.component.css']
})
export class ChefDashboardComponent implements OnInit {
    reservations: Reservation[] = [];
    chefId: number | null = null;
    isLoading = true;

    constructor(
        private reservationService: ReservationService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        const user = this.authService.getCurrentUser();
        // Only allow chefs (role_id === 1) to access this dashboard
        if (!user || user.role_id !== 1) {
            this.router.navigate(['/']);
            return;
        }
        this.chefId = user.id;
        this.loadReservations();
    }

    loadReservations(): void {
        if (!this.chefId) return;
        this.isLoading = true;
        this.reservationService.getReservationsByChef(this.chefId).subscribe({
            next: (data) => {
                this.reservations = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error fetching reservations:', err);
                this.isLoading = false;
            }
        });
    }

    updateStatus(reservation: Reservation, status: string): void {
        if (!reservation.id) return;

        this.reservationService.updateReservationStatus(reservation.id, status).subscribe({
            next: (updatedReservation) => {
                reservation.status = updatedReservation.status;
            },
            error: (err) => {
                console.error('Error updating status:', err);
                alert('Error al actualizar el estado.');
            }
        });
    }
}
