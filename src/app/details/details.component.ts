import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilmService } from '../Service/film.service';
import { Filmdetails } from '../Model/filmdetails';
import { Genre } from '../Model/genre';
import { CommonModule } from '@angular/common';
import { Editor, NgxEditorModule, Validators } from 'ngx-editor';
import {FormBuilder,FormControl,FormGroup,FormsModule,} from '@angular/forms';
import { Commentaire } from '../Model/Commentaire';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, NgxEditorModule, FormsModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  formData: { nom: string; comment: string } = { nom: '', comment: '' };
  form: FormGroup;
  userSub: Subscription;
  constructor(
    private filmservice: FilmService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      nom: ['', Validators.required], 
      comment: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getPopularMoviesById();
    this.getCommentaire();
    this.submit_commentaire();
    this.editor = new Editor();
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      this.filmId = id;

      this.getCommentaireFiltred(id);
    });
  }

  submit_commentaire() {
    const commentData = {
      idfilm: this.filmId,
      name: this.formData.nom,
      commentaire: this.formData.comment,
    };
    console.log(commentData);
    this.filmservice.addComment(commentData).subscribe(
      (response) => {
        console.log('Comment added successfully', response);
        this.getCommentaireFiltred(this.filmId);
      },
      (error) => {
        console.error('Error adding comment', error);
      }
    );
  }

  filmdetails!: Filmdetails;
  commentaire!: Commentaire;
  commentaireFiltred!: Commentaire[];
  filmId!: number;
  genre!: Genre[];

  editor!: Editor;
  html: string = 'hello world';
 

  getPopularMoviesById() {
    this.filmservice
      .getPopularMoviesById(this.activatedRoute.snapshot.params['id'])
      .subscribe((result) => {
        this.filmdetails = result;
        this.genre = this.filmdetails.genres;
      });
  }
  getCommentaire() {
    this.filmservice.getCommentaire().subscribe((result) => {
      this.commentaire = result;
    });
  }
  getCommentaireFiltred(idFilm: number) {
    console.log('now poe ', this.filmId);
    this.filmservice.getCommentaireFiltred(idFilm).subscribe((result) => {
      this.commentaireFiltred = result;
    });
  }
  deleteComment(id: number) {
    this.filmservice.deleteComment(id).subscribe(
      (response) => {
        console.log('Comment deleted successfully', response);
        this.getCommentaireFiltred(this.filmId);
      },
      (error) => {
        console.error('Error adding comment', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  protected readonly Editor = Editor;
  sanitizeHTML(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  onAddComment() {
    
      this.submit_commentaire;
     
  }
}
