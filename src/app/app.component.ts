import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { FilmService } from './Service/film.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HomeComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'movie-app';
  private destroy$: Subject<void> = new Subject<void>();
  userSub: Subscription;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private filmService: FilmService
  ) {}

  ngOnInit() {

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.userSub.unsubscribe();
  }
  onOpenFavorites() {
      this.router.navigate(['/favorited']);
  }
}
