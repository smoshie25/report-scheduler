import { Injectable } from '@angular/core';
import { Schedule } from './schedule';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders,HttpEvent ,HttpRequest} from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private BaseURL = 'https://test-report-scheduler.herokuapp.com';  // URL to web api
  content : any[];
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  constructor(private http: HttpClient,private messageService: MessageService) { }
  // private extractData(res: Response) {
  //   //let body = <Schedule[]>res.json().content;    
  //   return body || [];     
  // }

  getSchedules(): Observable<Schedule[]> {
    this.messageService.add('ScheduleService: fetched schedulees');
    return this.http.get<Schedule[]>(this.BaseURL+'/schedule').pipe(map(data => data["content"])); 
  }

  getSchedule(id: string): Observable<Schedule> {
    const url = `${this.BaseURL+'/schedule'}/${id}`;
  return this.http.get<Schedule>(url).pipe(
    tap(_ => this.log(`fetched Schedule id=${id}`)),
    catchError(this.handleError<Schedule>(`getSchedule id=${id}`))
  );
  }

  getDays(): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL+'/schedule/days')
      .pipe(
        tap(_ => this.log('fetched days')),
        catchError(this.handleError<any[]>('getDays', []))
      );
  }


  getTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL+'/schedule/types')
      .pipe(
        tap(_ => this.log('fetched Type')),
        catchError(this.handleError<any[]>('getTypes', []))
      );
  }

  /** ADD:  the schedule from the server */
  addSchedule(schedule: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>(this.BaseURL+'/schedule', schedule, this.httpOptions).pipe(
      tap((newSchedule: Schedule) => this.log(`added schedule w/ id=${newSchedule.id}`)),
      catchError(this.handleError<Schedule>('addSchedule'))
    );
  }

  /** DELETE: delete the schedule from the server */
  deleteSchedule(schedule: Schedule | number): Observable<Schedule> {
    const id = typeof schedule === 'number' ? schedule : schedule.id;
    const url = `${this.BaseURL}/${id}`;

    return this.http.delete<Schedule>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted schedule id=${id}`)),
      catchError(this.handleError<Schedule>('deleteSchedule'))
    );
  }

  /** PUT: update the schedule on the server */
  updateSchedule(schedule: Schedule): Observable<any> {
    return this.http.put(this.BaseURL, schedule, this.httpOptions).pipe(
      tap(_ => this.log(`updated schedule id=${schedule.id}`)),
      catchError(this.handleError<any>('updateSchedule'))
    );
  }

  private log(message: string) {
    this.messageService.add(`ScheduleService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.BaseURL}/uploadFile`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
}
