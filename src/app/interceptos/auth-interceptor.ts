import { HttpInterceptorFn } from '@angular/common/http';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    const modifiedRequest = req.clone({
      setHeaders: {
        authorization: `Bearer ${authToken}`,
      },
    });
    return next(modifiedRequest);
  }
  return next(req);
};
