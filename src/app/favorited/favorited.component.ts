import { Component, OnInit } from '@angular/core';
import { Film } from '../Model/film';
import { FilmService } from '../Service/film.service';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {forkJoin} from "rxjs";
import {HomeFilmComponent} from "../home-film/home-film.component";
import {NgFor} from "@angular/common";
import { Observable } from 'rxjs';


@Component({
  selector: 'app-favorited',
  templateUrl: './favorited.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    HomeFilmComponent,
    NgFor,
  ],
  styleUrls: ['./favorited.component.css']
})
export class FavoritedComponent implements OnInit {
  favoriteMovieIds: number[] = [];
  favoriteMovies: Film[] = [];


  constructor(private filmService: FilmService) { }

  ngOnInit(): void {
    this.loadFavoriteMovies();
    console.log(this.favoriteMovies);
  }

  loadFavoriteMovies() {
    console.log('Fetching favorite movie IDs...');
    this.filmService.getFavoriteMovieIds().subscribe((ids: any[]) => {
      console.log('Received favorite movie IDs:', ids);

      const requests: Observable<any>[] = [];

      for (let i = 0; i < ids.length; i++) {
        const movieId = ids[i]; 
        console.log('Fetching details for movie ID:', movieId);

        const request = this.filmService.getPopularMoviesById(movieId);
        requests.push(request);
      }

      if (requests.length > 0) {
        forkJoin(requests).subscribe((movies: any[]) => {
          console.log('Favorite movies details:', movies);

          for (let i = 0; i < movies.length; i++) {
            this.favoriteMovies.push(movies[i]);
          }

          console.log(this.favoriteMovies); 
        }, error => {
          console.error('Error fetching favorite movies details:', error);
        });
      } else {
        console.log('No favorite movie IDs found.');
      }
    });
  }







  getFavoriteMoviesDetails() {
    const requests = this.favoriteMovieIds.map(id =>
      this.filmService.getPopularMoviesById(id)
    );

    if (requests.length > 0) {
      forkJoin(requests).subscribe((results: any[]) => {
        this.favoriteMovies = results;
      });
    }
  }

  onFavoriteRemoved(movieId: number) {
    console.log('Removing favorite movie with ID:', movieId);

    const indexToRemove = this.favoriteMovies.findIndex(movie => movie.id === movieId);

    if (indexToRemove !== -1) {
      this.favoriteMovies.splice(indexToRemove, 1);
    }
  }

}
