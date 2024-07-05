import { Injectable } from '@angular/core';
import { Document } from '../interfaces/document';
import { HttpClient } from '@angular/common/http';
import { Person } from '../interfaces/person';
import { PERSON_EXAMPLE_DATA } from '../interfaces/data';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Person[]> {
    return this.httpClient
      .get<Person[]>('http://localhost:8080/person/all');
  }

  put(documento: Document): void {
    this.httpClient
      .put('https://jsonplaceholder.typicode.com/todos/1', documento)
      .subscribe();
  }

  post(documento: Document): void {
    this.httpClient
      .post('https://jsonplaceholder.typicode.com/todos', documento)
      .subscribe();
  }

  delete(id: number): void {
    this.httpClient
      .delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .subscribe();
  }
}
