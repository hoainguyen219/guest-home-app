import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Hostel } from 'src/app/shared/interfaces/hostel';
import { ConfigService } from 'src/app/shared/services/config.service';
import { HostelService } from 'src/app/shared/services/hostel.service';

declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit, AfterViewInit {
  public hostelSubject$: BehaviorSubject<any> = new BehaviorSubject({});

  public searchForm: FormGroup;
  public searchType$: Observable<number>;
  public searchLat: number;
  public searchLng: number;
  public radius: number;
  public options = {
    componentRestrictions: {
      country: ['VN']
    }
  };

  public hostel$: Observable<Hostel>;
  public city$: Observable<any>;
  public district$: Observable<any>;

  @ViewChild('hostelResponse', { read: ElementRef }) HostelView: ElementRef;

  constructor(
    private config: ConfigService,
    private formBuilder: FormBuilder,
    private hostel: HostelService
  ) { }

  ngOnInit(): void {
    this.searchType$ = this.config.searchType$.pipe(
      map((val) => {
        this.searchForm.patchValue({
          address: '',
          city: '',
          district: '',
          radius: '',
          price: '',
          area: '',
          fromDate: moment().format('YYYY-MM-DD'),
          toDate: new Date(moment().add(1, 'days').format('YYYY-MM-DD')),
          distance: '',
        });
        this.searchLat = 0;
        this.searchLng = 0;
        return val;
      })
    );
    this.city$ = this.hostel.getCity();
    // formData
    this.searchForm = this.formBuilder.group({
      address: [''],
      city: [''],
      district: [''],
      radius: [''],
      price: [''],
      area: [''],
      fromDate: [moment().format('YYYY-MM-DD')],
      toDate: [new Date(moment().add(1, 'days').format('YYYY-MM-DD'))],
      distance: [''],
    });

    this.hostel$ = this.hostelSubject$.pipe(
      switchMap(params => this.hostel.getHostels(params))
    );
  }

  ngAfterViewInit(): void {
    // gắn loại dữ liệu tìm kiếm
    // chọn ngày
    $('#datepicker').daterangepicker({
      startDate: new Date(),
      endDate: new Date(moment().add(1, 'days').format('YYYY-MM-DD'))
    }, (start, end, label) => {
      this.searchForm.controls.fromDate.patchValue(start.format('YYYY-MM-DD'));
      this.searchForm.controls.toDate.patchValue(end.format('YYYY-MM-DD'));
      this.hostel.setDateSearch({ fromDate: start.format('YYYY-MM-DD'), toDate: end.format('YYYY-MM-DD') });
    });
  }

  search(): void {
    const valueSearch = this.searchForm.value;
    this.hostel.setDateSearch({ fromDate: valueSearch.fromDate, toDate: valueSearch.toDate });
    localStorage.setItem('dateSelected', JSON.stringify(this.hostel.dateTime));

    const params = {
      minPrice: valueSearch.price.split('-')[0] || '',
      maxPrice: valueSearch.price.split('-')[1] || '',
      city: valueSearch.city.name || '',
      district: valueSearch.district.name || '',
      minArea: valueSearch?.area?.split('-')[0] || '',
      maxArea: valueSearch?.area?.split('-')[1] || '',
      lat: this.searchLat || '',
      lng: this.searchLng || '',
      fromDate: valueSearch.fromDate,
      toDate: valueSearch.toDate,
      distance: valueSearch.distance,
    };

    this.hostelSubject$.next(params);
    this.HostelView.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  searchHostelByMap(params?): void {
    // khi click sẽ truyền lên dữ liệu tìm kiếm bằng api khác :D
    if (params?.address) {
      this.searchForm.get('address').patchValue(params.address);
    }

    const form = this.searchForm.value;
    this.radius = form.distance * 1000;

    const query = `${form.address}`;
    this.hostel.searchHostel(query).subscribe(
      val => {
        console.log(val);
        if (val.results[0]) {
          const location = val.results[0].geometry.location;
          this.searchLat = location.lat;
          this.searchLng = location.lng;
          this.search();
          if (this.searchForm.value.radius) {
            this.radius = this.searchForm.value.radius * 1000;
          }
        }
      },
      err => console.log(err)
    );

  }

  searchDistrictByCity(event) {
    this.searchForm.get('district').patchValue('');
    const city = this.searchForm.value.city;

    this.district$ = this.hostel.getDistrict(city.id);
  }

  ngOnDestroy() {

  }
}
