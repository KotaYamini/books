import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Books } from '../models/books';
@Injectable({
  providedIn: 'root'
})
export class BooksService {
  baseUrl = environment.apiBaseURL

  constructor(private http: HttpClient) { }


  getBooksList(): Observable<Books>{
    return this.http.get<Books>(this.baseUrl);
  }
}
