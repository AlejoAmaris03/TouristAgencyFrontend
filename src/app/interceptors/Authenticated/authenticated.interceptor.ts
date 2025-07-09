import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services';

export const authenticatedInterceptor: HttpInterceptorFn = (req, next) => {
  const token = new AuthService().getToken();

  if(token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(cloned);
  }

  return next(req);
};
