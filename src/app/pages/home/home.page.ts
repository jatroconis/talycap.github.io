import { Component, computed, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MoviesTableComponent } from '../../features/movies/movies-table.component';
import { WeatherTableComponent } from '../../features/weather/weather-table.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatTabsModule, MatCardModule, MoviesTableComponent, WeatherTableComponent],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  count = signal(0);
  countText = computed(() => `Contador: ${this.count()}`);
  inc() { this.count.update(v => v + 1); }
  dec() { this.count.update(v => v - 1); }
}
