import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { createTupleTypeNode } from 'typescript';

@Injectable()
export class CryptoService  {
  
    URL_ALPHA = 'https://www.alphavantage.co/query?';
    API_KEY = 'SUA_API_KEY';

    URL_CRYPTOS = 'http://localhost:8080/v1/cryptos';

    URL_CRYPTOS_FOLLOW = 'http://localhost:8080/v1/cryptos/follow';

    constructor(private http: HttpClient,){
      
    }

    public getCryptoIntraday(idCrypto: string) {
        
        let url = this.URL_ALPHA + `function=CRYPTO_INTRADAY&symbol=${idCrypto}&market=BRL&interval=15min&apikey=` + this.API_KEY;

        return this.http.get(url, {}).pipe(
            map(response => {
                return response;
            }),
            catchError(this.handleError('getCryptoIntraday'))); 

    }

    public getAllCryptos() {
        
        let url = this.URL_CRYPTOS;

        return this.http.get(url, {}).pipe(
            map(response => {
                return response;
            }),
            catchError(this.handleError('getAllCryptos'))); 

    }


    public getCryptoMonth(idCrypto: string) {


        let url = this.URL_ALPHA + `function=DIGITAL_CURRENCY_MONTHLY&symbol=${idCrypto}&market=BRL&apikey=` + this.API_KEY;

        return this.http.get(url, {}).pipe(
            map(response => {
                return response;
            }),
            catchError(this.handleError('getCryptoIntraday'))); 

    }

    public saveOrUpdate(crypto) {

        let url = this.URL_CRYPTOS_FOLLOW;

        if(crypto.id && crypto.id > 0){
            
            return this.http.put(url + `/${crypto.id}/`, crypto, {}).pipe(
                map(response => {
                    return response;
                }),
                catchError(this.handleError('getAllCryptos'))); 

        }else{

            return this.http.post(url, crypto, {}).pipe(
                map(response => {
                    return response;
                }),
                catchError(this.handleError('getAllCryptos'))); 

        }

    }

    public getCryptoFollows() {
        
        let url = this.URL_CRYPTOS_FOLLOW

        return this.http.get(url, {}).pipe(
            map(response => {
                return response;
            }),
            catchError(this.handleError('getCryptoFollows'))); 

    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

        console.error(error);

        console.log(`${operation} failed: ${error.message}`);

        return throwError(error);
        };
    }

}