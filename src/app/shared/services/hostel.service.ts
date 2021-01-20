import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GlobalConfig } from '../config/common';
import { Hostel } from '../interfaces/hostel';
@Injectable({
  providedIn: 'root'
})
export class HostelService {
  public apiKey = GlobalConfig.API_KEY;
  public googleSearchApi = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
  public dateTime;

  constructor(
    private http: HttpClient
  ) {
    this.dateTime =  {
      fromDate: moment().format('YYYY-MM-DD'),
      toDate: moment().add(1, 'days').format('YYYY-MM-DD'),
      dateDiff: 1
    };
   }

  getHostels(params = {}, id?: string): Observable<Hostel> {
    const getHostelApi = `${this.apiKey}/posts`;
    console.log(id);

    return id
      ? this.http.get(`${getHostelApi}/${id}`) as Observable<Hostel>
      : this.http.get(getHostelApi, {params}) as Observable<Hostel>;
  }

  getDistrict(city?: string): Observable<Hostel> {
    const getHostelApi = `${this.apiKey}/cities/${city}`;
    return this.http.get(getHostelApi) as Observable<any>;
  }

  postHostels(params): Observable<Hostel> {
    const headerOptions: HttpHeaders = new HttpHeaders(
      {
        'Content-Type': 'multipart/form-data'
      }
    );
    return this.http.post(`${this.apiKey}/posts`, params) as Observable<Hostel>;
  }

  editHostels(params, postId): Observable<Hostel> {
    const headerOptions: HttpHeaders = new HttpHeaders(
      {
        'Content-Type': 'multipart/form-data'
      }
    );
    return this.http.post(`${this.apiKey}/posts/update/${postId}`, params) as Observable<Hostel>;
  }


  searchHostel(query): Observable<any> {
    const params = {
      query,
      key: environment.apiKey
    };
    return this.http.get(this.googleSearchApi, {
      params
    }) as Observable<any>;
  }

  getCity(): Observable<any> {
    const getHostelApi = `${this.apiKey}/cities`;
    return this.http.get(getHostelApi);
  }

  setDateSearch(dateSearch): void {
    console.log(dateSearch);
    this.dateTime = dateSearch;
  }

  bookHostel(data): Observable<any> {
    const id = data.postId;
    const params = {
      fromDate: data.fromDate,
      toDate: data.toDate,
      userId: data.userId
    };
    return this.http.post(`${this.apiKey}/posts/${id}/booking`, params);
  }

  // Get danh sách đã đặt phòng.
  getScheduleByUserId(userId): Observable<Hostel> {
    return this.http.get(`${this.apiKey}/schedule/${userId}`) as Observable<Hostel>;
  }

  // get danh sách phòng đăng.
  getPostListByUserId(userId): Observable<Hostel> {
    return this.http.get(`${this.apiKey}/list/${userId}`) as Observable<Hostel>;
  }

  // đánh giá phòng đã đặt
  ratingSchedule(params): Observable<any> {
    const { scheduleId } = params;
    return this.http.post(`${this.apiKey}/posts/${scheduleId}/rating`, params);
  }

  // lấy danh sách đã đặt phòng
  getScheduleListById(params): Observable<any> {
    const { postId } = params;
    return this.http.get(`${this.apiKey}/getSchedule/${postId}`);
  }

  manageSchedule(params): Observable<any> {
    const { userId } = params;
    return this.http.get(`${this.apiKey}/manageSchedule/${userId}`);
  }
}
