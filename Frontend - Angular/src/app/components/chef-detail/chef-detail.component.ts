import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ChefService, ChefProfile } from '../../services/chef.service';

@Component({
    selector: 'app-chef-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './chef-detail.component.html',
    styleUrls: ['./chef-detail.component.css']
})
export class ChefDetailComponent implements OnInit {
    chef: ChefProfile | null = null;
    menus: any[] = [];
    loading = true;

    private route = inject(ActivatedRoute);
    private chefService = inject(ChefService);
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

    reserve() {
        if (this.chef && this.chef.id) {
            this.router.navigate(['/reservations'], { queryParams: { chefId: this.chef.id } });
        }
    }
}
