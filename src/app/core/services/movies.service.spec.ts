import { TestBed } from '@angular/core/testing';
import { MoviesService } from './movies.service';
import { environment } from '../../../environments/environment';
import { TvMazeSearchItemDTO, TvMazeShowDTO } from '../models';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';

describe('MoviesService (TVMaze)', () => {
  let service: MoviesService;
  let http: HttpTestingController;
  const base = environment.tvMazeBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MoviesService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ],
    });
    service = TestBed.inject(MoviesService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('debe obtener listado y paginar en cliente', (done) => {
    service.getMovies(1, 10, '').subscribe(res => {
      expect(res.page).toBe(1);
      expect(res.items.length).toBe(10);  
      expect(res.total).toBe(25);       
      expect(res.totalPages).toBe(3);     
      done();
    });

    const req = http.expectOne(`${base}/shows?page=0`);
    expect(req.request.method).toBe('GET');

    const payload: TvMazeShowDTO[] = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `Show ${i + 1}`,
      premiered: '2020-01-01',
      rating: { average: 7 + (i % 3) * 0.1 },
      image: { medium: `poster${i + 1}.jpg` }
    }));
    req.flush(payload);
  });

  it('debe buscar por nombre y paginar en cliente', (done) => {
    service.getMovies(2, 2, 'matrix').subscribe(res => {
      expect(res.page).toBe(2);
      expect(res.total).toBe(3);
      expect(res.totalPages).toBe(2);
      expect(res.items.length).toBe(1);
      expect(res.items[0].title).toBe('Matrix 3');
      done();
    });

    const req = http.expectOne(`${base}/search/shows?q=matrix`);
    expect(req.request.method).toBe('GET');

    const payload: TvMazeSearchItemDTO[] = [
      { score: 10, show: { id: 11, name: 'Matrix 1', premiered: '1999-03-31', rating: { average: 8.7 }, image: { medium: 'm1.jpg' } } },
      { score: 9,  show: { id: 12, name: 'Matrix 2', premiered: '2003-05-15', rating: { average: 7.0 }, image: { medium: 'm2.jpg' } } },
      { score: 8,  show: { id: 13, name: 'Matrix 3', premiered: '2003-11-05', rating: { average: 6.7 }, image: { medium: 'm3.jpg' } } },
    ];
    req.flush(payload);
  });
});
