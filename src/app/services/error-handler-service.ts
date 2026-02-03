import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network Error: ${error.error.message}`;
    } else {
      // Server-side error - map status codes to user-friendly messages
      switch (error.status) {
        case 400:
          errorMessage =
            'Bad Request: The data you provided is invalid. Please check and try again.';
          break;
        case 401:
          errorMessage = 'Unauthorized: You need to log in to access this resource.';
          break;
        case 403:
          errorMessage = 'Forbidden: You do not have permission to access this resource.';
          break;
        case 404:
          errorMessage = 'Not Found: The requested resource could not be found.';
          break;
        case 500:
          errorMessage = 'Server Error: Something went wrong on our end. Please try again later.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message || 'An unexpected error occurred.'}`;
      }
    }

    // Return observable error for components to handle
    return throwError(() => errorMessage);
  }
}
