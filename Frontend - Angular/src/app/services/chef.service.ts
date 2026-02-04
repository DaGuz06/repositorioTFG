import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChefProfile {
    id?: number;
    name?: string;
    email?: string;
    specialties: string[];
    work_zone: string;
    has_vehicle: boolean;
    bio: string;
    rating?: number;
    image?: string;
    user_id?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ChefService {
    private http = inject(HttpClient);
    private apiUrl = '/api/chefs';

    getChefs(): Observable<ChefProfile[]> {
        return this.http.get<ChefProfile[]>(this.apiUrl);
    }

    getChefById(id: number): Observable<ChefProfile> {
        return this.http.get<ChefProfile>(`${this.apiUrl}/${id}`);
    }

    createProfile(profileData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/profile`, profileData);
    }

    getChefReviews(chefId: number): Observable<any[]> {
        return this.http.get<any[]>(`/api/reviews?chefId=${chefId}`);
    }

    getChefMenus(chefId: number): Observable<any[]> {
        return this.http.get<any[]>(`/api/menus?chefId=${chefId}`);
    }

    addMenu(menuData: any): Observable<any> {
        return this.http.post<any>('/api/menus', menuData);
    }

    deleteMenu(menuId: number): Observable<any> {
        return this.http.delete<any>(`/api/menus/${menuId}`);
    }
}
