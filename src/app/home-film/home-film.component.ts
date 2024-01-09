import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Film} from "../Model/film";
import {FilmService} from "../Service/film.service";
import {DetailsComponent} from "../details/details.component";
import {RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {findLastMappingIndexBefore} from "@angular/compiler-cli/src/ngtsc/sourcemaps/src/source_file";


@Component({
  selector: 'app-home-film',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './home-film.component.html',
  styleUrl: './home-film.component.css'
})
export class HomeFilmComponent {
  @Input() film!: Film;
  @Output() favoriteRemoved: EventEmitter<number> = new EventEmitter<number>();

  constructor(private filmService: FilmService) { }

  ngOnInit(): void {
    this.checkFavoriteStatus(this.film);
  }

  getUrl(name: any) {
    return this.filmService.getimagefromapi(name);
  }

  toggleFavorite(film: Film) {
    film.favorite = !film.favorite;

    if (film.favorite) {
      this.filmService.addFavoriteMovie(film.id).subscribe(
        () => {
          console.log('Movie added to favorites:', film.id);
          // Handle success if needed
        },
        (error) => {
          console.error('Error adding movie to favorites:', error);
          // Handle error if needed
        }
      );
    } else {
      this.filmService.removeFavoriteMovie(film.id).subscribe(
        () => {
          console.log('Movie removed from favorites:', film.id);
          this.favoriteRemoved.emit(film.id); 
        },
        (error) => {
          console.error('Error removing movie from favorites:', error);
        }
      );
    }
  }

  checkFavoriteStatus(film: Film) {
    this.filmService.getFavoriteMovieIds().subscribe(
      (favoriteMovieIds: number[]) => {
        if (favoriteMovieIds.includes(film.id)) {
          film.favorite = true;
        } else {
          film.favorite = false; 
        }
      },
      (error) => {
        console.error('Error retrieving favorite movie IDs:', error);
      }
    );
  }
}
