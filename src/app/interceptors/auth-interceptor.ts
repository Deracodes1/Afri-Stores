import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtAuthToken = localStorage.getItem('authToken');
  //  if jwt token exists in the loacl storage then get it, attach it to the every request headers
  if (jwtAuthToken) {
    const modifiedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtAuthToken}`,
        'X-Requested-From': 'Web App', // i added this to let the db able to tell if the request from the web app or mobile app version
      },
    });
    return next(modifiedRequest);
  }
  //  if jwt token does not exists in the loacl storage
  // then send the request like that anyways
  return next(req);
};
