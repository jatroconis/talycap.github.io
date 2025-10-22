
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiKeysInterceptor: HttpInterceptorFn = (req, next) => {
  const tmdbBase = environment.tmdbBaseUrl;
  const owBase = environment.openWeatherBaseUrl;
  let cloned = req;

  if (req.url.startsWith(tmdbBase)) {
    cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${environment.tmdbApiKey}`
      }
    });
  }

  if (req.url.startsWith(owBase)) {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    if (!params.has('appid')) params.set('appid', environment.openWeatherApiKey);

    const newUrl = `${url.origin}${url.pathname}?${params.toString()}`;
    cloned = cloned.clone({ url: newUrl });
  }

  return next(cloned);
};
