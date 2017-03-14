import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { environment } from '../../../environments/environment'

@Injectable()
export class AssetManagerService {

    constructor(
        private http: Http
    ) { }

    updateAssets(assets) {
        let headers = new Headers();
        headers.append('Content-Type', ' application/json');
        return this.http.post(environment.baseUrl + '/assets', JSON.stringify(assets), { headers })
        .map(res => res.json())
    }
}
