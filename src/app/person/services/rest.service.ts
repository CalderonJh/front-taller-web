import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person } from '../interfaces/person';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Person[]> {
    return this.httpClient.get<Person[]>('http://localhost:8080/person/all');
  }

  put(person: Person): Observable<string> {
    return this.httpClient
      .put('http://localhost:8080/person/update', person)
      .pipe(
        map(() => 'Actualizado correctamente'),
        catchError((e) => {
          console.log(e);
          return of('Error actualizando persona');
        }),
      );
  }

  post(person: Person): Observable<string> {
    return this.httpClient
      .post('https://jsonplaceholder.typicode.com/todos', person)
      .pipe(
        map(() => 'Creado correctamente'),
        catchError(() => {
          return of('Error creando persona');
        })
      );
  }

  delete(person: Person): Observable<string> {
    return this.httpClient
      .delete(`http://localhost:8080/person/delete/${person.id}`)
      .pipe(
        map(() => 'Eliminaste a '.concat(person.name)),
        catchError(() => {
          return of('Error deleting person');
        }),
      );
  }
}
