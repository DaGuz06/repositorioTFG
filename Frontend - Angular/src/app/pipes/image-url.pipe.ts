import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
    name: 'imageUrl',
    standalone: true
})
export class ImageUrlPipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (!value) return '';
        if (value.startsWith('http') || value.startsWith('data:')) return value;
        return `${environment.apiUrl}${value}`;
    }
}
