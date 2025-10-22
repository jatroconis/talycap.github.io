import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snack = inject(MatSnackBar);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      let message = 'Ocurrió un error al comunicarse con el servidor.';
      if (err.status === 0) {
        message = 'Sin conexión. Verifica tu red.';
      } else if (err.status === 401 || err.status === 403) {
        message = 'No autorizado. Revisa tus credenciales de API.';
      } else if (err.status === 404) {
        message = 'Recurso no encontrado.';
      } else if (err.status === 429) {
        message = 'Límite de peticiones excedido (rate limit). Intenta más tarde.';
      } else if (err.status >= 500) {
        message = 'Error del servidor. Intenta más tarde.';
      }

      snack.open(message, 'Cerrar', { duration: 4000 });

      return throwError(() => err);
    })
  );
};
