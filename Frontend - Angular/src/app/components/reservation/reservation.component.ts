import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService, Reservation } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-reservation',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './reservation.component.html',
    styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {
    reservation: Reservation = {
        name: '',
        street: '',
        contact_number: '',
        date: new Date()
    };

    dateString: string = '';

    constructor(
        private reservationService: ReservationService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.route.queryParams.subscribe(params => {
            if (params['chefId']) {
                this.reservation.chef_id = +params['chefId'];
            }
        });
    }

    onSubmit() {
        this.reservation.date = new Date(this.dateString);

        const currentUser = this.authService.getCurrentUser();
        if (currentUser && currentUser.id) {
            this.reservation.user_id = currentUser.id;
        }

        this.reservationService.createReservation(this.reservation).subscribe({
            next: (res) => {
                alert('Reserva creada con éxito');
                this.reservation = { name: '', street: '', contact_number: '', date: new Date(), chef_id: this.reservation.chef_id };
                this.dateString = '';
            },
            error: (err) => {
                console.error('Error creating reservation:', err);
                alert('Error al crear la reserva');
            }
        });
    }
}
