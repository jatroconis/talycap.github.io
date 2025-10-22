import { Component, signal, inject, effect } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MoviesTableComponent } from '../../features/movies/movies-table.component';
import { WeatherTableComponent } from '../../features/weather/weather-table.component';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatTabsModule, MatCardModule, MoviesTableComponent, WeatherTableComponent],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  tabIndex = signal(0);

  constructor() {
    const qp = this.route.snapshot.queryParamMap;
    const tab = (qp.get('tab') ?? 'movies').toLowerCase();
    this.tabIndex.set(tab === 'weather' ? 1 : 0);
  }

  onTabChange(index: number) {
    this.tabIndex.set(index);
    const tabValue = index === 1 ? 'weather' : 'movies';
    this.updateQuery({ tab: tabValue });
  }

  private updateQuery(params: Params) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
