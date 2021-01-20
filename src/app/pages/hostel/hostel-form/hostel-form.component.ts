import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { HostelService } from 'src/app/shared/services/hostel.service';

@Component({
  selector: 'app-hostel-form',
  templateUrl: './hostel-form.component.html',
  styles: [
  ]
})
export class HostelFormComponent implements OnInit, OnDestroy {
  public isPost: boolean;
  public hostelForm: FormGroup;
  public formattedaddress = ' ';
  public options = {
    componentRestrictions: {
      country: ['VN']
    }
  };
  public city: string;
  public district: string;
  public hostelSub$: Subscription;
  public imagesUrls = [];
  public postId;

  @Input() currentUser;

  @ViewChild('imagesView', { read: ElementRef }) imagesView: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private hostel: HostelService,
    private toastr: ToastrService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    const curUser = JSON.parse(localStorage.getItem('user'));
    this.isPost = this.activatedRoute.snapshot.data.isPost;
    this.postId = this.activatedRoute.snapshot.queryParams.postId;
    this.hostelForm = this.formBuilder.group({
      title: ['', Validators.required],
      area: ['', Validators.required],
      price: ['', [Validators.required, Validators.maxLength(12)]],
      bedroom: [null],
      bathroom: [null],
      address: [''],
      utilities: this.formBuilder.group({}),
      description: [''],
      images: [],
      lat: [],
      lng: [],
      userId: curUser.user_id
    });
  }

  ngAfterViewInit(): void {
    if (this.postId && !this.isPost) {

      this.hostel.getHostels({}, this.postId).subscribe(
        state => {
          this.hostelForm.patchValue({
            title: state.title,
            area: state.area,
            price: state.price,
            address: state.address,
            bedroom: state.bedroom,
            bathroom: state.bathroom,
            description: state.description,
            images: state.urlImages,
            lat: state.lat,
            lng: state.lng,
            city: state.city,
            district: state.district
          });

          if (state.urlImages.length > 0) {
            this.imagesUrls = state.urlImages;
          }

          this.formControls.utilities = this.formBuilder.group({
            wc: state.wc || null,
            garage: state.garage || null,
            electric_water_heater: state.electric_water_heater || null,
            air_condition: state.air_condition || null
          });

          this.hostelForm.updateValueAndValidity();
          console.log(this.hostelForm.value);
        }
      );
    }
  }

  editHostel(): void {
    this.hostelForm.markAllAsTouched();
    if (this.hostelForm.invalid) {
      return;
    }

    const params = {
      ...this.hostelForm.value,
      city: this.city,
      district: this.district,
    };
    console.log('dữ liệu thay đổi:', params);

    const formData: FormData = new FormData();
    for (const key in params) {
      if (key === 'images' && params[key]) {
        for (const image of params[key]) {
          formData.append('images', image);
        }
      }
      else if (key === 'utilities' && params[key]) {
        // tslint:disable-next-line: forin
        formData.append('utilities', JSON.stringify(params[key]));
      }
      else {
        formData.append(key, params[key]);
      }
    }

    this.hostelSub$ = this.hostel.editHostels(formData, this.postId).subscribe(
      val => {
        console.log('post khách sạn thành công', val);
        this.toastr.success('Quý khách đã sửa thông tin thành công.', 'Thành công', {
          timeOut: 2000,
        });
        this.router.navigate(['/hostel/posted']);
      },
      err => console.log(err)
    );
  }

  postHostel(): void {
    this.hostelForm.markAllAsTouched();
    if (this.hostelForm.invalid) {
      return;
    }

    const params = {
      ...this.hostelForm.value,
      city: this.city,
      district: this.district,
    };

    const formData: FormData = new FormData();
    for (const key in params) {
      if (key === 'images' && params[key]) {
        for (const image of params[key]) {
          formData.append('images', image);
        }
      }
      else if (key === 'utilities' && params[key]) {
        // tslint:disable-next-line: forin
        formData.append('utilities', JSON.stringify(params[key]));
      }
      else {
        formData.append(key, params[key]);
      }
    }

    this.hostelSub$ = this.hostel.postHostels(formData).subscribe(
      val => {
        this.toastr.success('Quý khách đã đăng bài thành công.', 'Thành công', {
          timeOut: 1500,
        });
        this.router.navigate(['/hostel/posted']);
      },
      err => console.log(err)
    );
  }

  onCheckUtilities(e): void {
    const checkArray: FormGroup = this.hostelForm.get('utilities') as FormGroup;

    if (e.target.checked) {
      const ultility = checkArray.get(e.target.defaultValue);
      if (ultility) {
        ultility.patchValue(true);
        this.hostelForm.updateValueAndValidity();
      } else {
        checkArray.addControl(e.target.defaultValue, this.formBuilder.control(true));
      }
    } else {
      checkArray.removeControl(e.target.defaultValue);
    }
  }

  selectImageUrl(event): void {
    const image = (event.target as HTMLInputElement).files;
    if (image && image.length > 0) {
      this.hostelForm.get('images').patchValue(image);
      const filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i += 1) {
        const reader = new FileReader();
        reader.onload = (eventLoad: any) => {
          this.imagesUrls.push(eventLoad.target.result);
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  deleteImgUrl(idx): void {
    const files: FileList = this.hostelForm.get('images').value;
    console.log(this.hostelForm.get('images').value);

    const b = new ClipboardEvent('').clipboardData || new DataTransfer();
    for (let i = 0; i < files.length; i++) {
      if (i === idx) {
        this.imagesUrls.splice(i, 1);
        console.log(this.imagesView);
      }
      if (i !== idx) {
        b.items.add(files[i]);
      }
    }
    const images = b.files;
    console.log(images);

    this.formControls.images.patchValue(images);
  }

  addressChange(address): void {
    this.city = address.address_components.filter(add => add.types.indexOf('administrative_area_level_1') > -1)[0]?.long_name || '';
    this.district = address.address_components.filter(add => add.types.indexOf('administrative_area_level_2') > -1)[0]?.long_name || '';
    this.formattedaddress = address.formatted_address;
    this.formControls.address.patchValue(this.formattedaddress);
    console.log(address.geometry.location.lat(), address.geometry.location.lng());

    this.formControls.lat.patchValue(address.geometry.location.lat());
    this.formControls.lng.patchValue(address.geometry.location.lng());
    this.hostelForm.updateValueAndValidity();
  }

  // tslint:disable-next-line: typedef
  get formControls() {
    return this.hostelForm.controls;
  }

  ngOnDestroy(): void {
    if (this.hostelSub$) {
      this.hostelSub$.unsubscribe();
    }
  }
}
