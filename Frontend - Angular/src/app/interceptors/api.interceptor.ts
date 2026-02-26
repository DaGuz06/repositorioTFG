import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    // Solo interceptamos si la request empieza por /api o /uploads y tenemos una apiUrl definida (producción)
    const isApiOrUpload = req.url.startsWith('/api') || req.url.startsWith('/uploads');

    if (isApiOrUpload && environment.apiUrl) {
        const clonedReq = req.clone({
            url: `${environment.apiUrl}${req.url}`
        });
        return next(clonedReq);
    }

    return next(req);
};
