import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService, Reservation } from '../../services/reservation.service';
import { ChefService } from '../../services/chef.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-reservation',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './reservation.component.html',
    styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
    reservation: Reservation = {
        name: '',
        street: '',
        contact_number: '',
        date: new Date()
    };

    dateString: string = '';
    chefName: string = '';
    isLoading = false;
    successMessage = '';
    errorMessage = '';

    constructor(
        private reservationService: ReservationService,
        private chefService: ChefService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['chefId']) {
                this.reservation.chef_id = +params['chefId'];
                // Load chef name
                this.chefService.getChefById(this.reservation.chef_id).subscribe({
                    next: (chef) => this.chefName = chef.name || 'Chef',
                    error: () => this.chefName = ''
                });
            }
        });

        // Pre-fill name from logged-in user
        const user = this.authService.getCurrentUser();
        if (user && user.name) {
            this.reservation.name = user.name;
        }
    }

    onSubmit() {
        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';

        this.reservation.date = new Date(this.dateString);

        const currentUser = this.authService.getCurrentUser();
        if (currentUser && currentUser.id) {
            this.reservation.user_id = currentUser.id;
        }

        this.reservationService.createReservation(this.reservation).subscribe({
            next: (res) => {
                this.isLoading = false;
                this.successMessage = '¡Reserva creada con éxito! El chef confirmará pronto.';
                // Reset form but keep chef_id
                this.reservation = {
                    name: currentUser?.name || '',
                    street: '',
                    contact_number: '',
                    date: new Date(),
                    chef_id: this.reservation.chef_id
                };
                this.dateString = '';
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = 'Error al crear la reserva. Inténtalo de nuevo.';
                console.error('Error creating reservation:', err);
            }
        });
    }
}
