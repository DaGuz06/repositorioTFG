import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewsComponent } from '../reviews/reviews.component';
import { ChefsComponent } from '../chefs/chefs.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReviewsComponent, ChefsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

}
