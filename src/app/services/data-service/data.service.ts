import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class dataService {
  
  private headers!:any
  constructor(private http:HttpClient) {
    this.headers = new HttpHeaders()
    .set('x-hasura-admin-secret', 'Pz1WVDPTBnbgVw4LsWdMgX7CzT1CEojU1Aeoy0LHN1hk2lX9eCAiZGyBScpxfbNi')
    .set('Content-Type', 'application/json');
  }



  getHidrantes(): Observable<any> {
    const headers= this.headers
    return this.http.get<any>(`https://hidrantes.hasura.app/api/rest/getHidrantes`,{headers})
    .pipe(
      tap({
        error: (err) => console.log(err)
      })
      )
  }

  createHidrante(data:any): Observable<any> {
    const headers= this.headers
    return this.http.post<any>(`https://hidrantes.hasura.app/api/rest/createhidrante`,data , {headers})
    .pipe(
      tap({
        error: (err) => console.log(err)
      })
      )
  }

  updateHidrante(data:any): Observable<any> {
    const headers= this.headers
    return this.http.put<any>(`https://hidrantes.hasura.app/api/rest/updatehidrante`,data , {headers})
    .pipe(
      tap({
        error: (err) => console.log(err)
      })
      )
  }

  
}
