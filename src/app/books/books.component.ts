import { Component, OnDestroy, OnInit } from '@angular/core';
import { BooksService } from '../services/books.service';
import { Subscription } from 'rxjs';
import { Book, Data } from '../models/books';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  newBookForm!: FormGroup;
  booksList!: Data;
  searchTerm: string = '';
  sortMethod: 'title' | 'PublishDate' = 'title';
  newBook: any = {}; // Object to store new book details

  selectedBookIndex: number | null = null;

  constructor(private formBuilder: FormBuilder,private booksService: BooksService) {

  }

  ngOnInit(): void {
    this.newBookForm = this.formBuilder.group({
      title: ['', Validators.required],
      purchaseLink: ['', Validators.required],
      PublishDate: ['', Validators.required],
      imageUrl: ['', Validators.required]
    });
    // Get the books list
    this.getBooksList();
  }

 // sort data in two ways: alphabetically by title or chronological by publish date
  toggleSortMethod() {
    this.sortMethod = this.sortMethod === 'title' ? 'PublishDate' : 'title';
    this.sortBooks();
  }

  sortBooks() {
    if (this.sortMethod === 'title') {
      this.booksList.books.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.sortMethod === 'PublishDate') {
      this.booksList.books.sort((a, b) => parseInt(a.PublishDate, 10) - parseInt(b.PublishDate, 10));
    }
  }

  searchBooks() {
    // Filter books based on the search term using 'Search'
    if (this.searchTerm) {
      this.booksList.books = this.booksList.books.filter(book =>
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.booksList.books = this.getBooksList() as unknown as Book[];
    }
  }

  getBooksList() {
    this.subscription.add(this.booksService.getBooksList().subscribe(response => {
      console.log(this.booksList)
      if (response) {
        this.booksList = response?.data;
        console.log(this.booksList)
      }
    }));
  }

 // create new book
  addBook() {
    this.booksList?.books.push(this.newBookForm.value);
    this.newBookForm.reset(); // Reset the form after adding
  }

  // delete the book
  deleteBook(index: number) {
    this.booksList?.books.splice(index, 1);
  }

  // select the book
  selectBookForEdit(index: number) {
    this.selectedBookIndex = index;
    this.newBookForm.setValue({ ...this.booksList?.books[index] });
  }

  // Update the Book
  updateBook() {
    if (this.selectedBookIndex !== null) {
      this.booksList.books[this.selectedBookIndex] = { ...this.newBookForm.value };
      this.selectedBookIndex = null;
      this.newBookForm.reset(); // Reset the form after updating
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
