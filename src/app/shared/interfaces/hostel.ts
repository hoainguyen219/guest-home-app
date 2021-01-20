export interface HostelSearchType {
  city?: string;
  district?: string;
  price?: number;
  area?: number;
  fromDate?: string;
  toDate?: string;
}

export interface Hostel {
    address: string;
    air_condition: number;
    area: number;
    bathroom: number;
    bedroom: number;
    city?: any;
    create_date?: any;
    description: string;
    district?: any;
    electric_water_heater: number;
    garage: number;
    lat?: any;
    lng?: any;
    postBy?: any;
    postId: number;
    price: number;
    title: string;
    update_date?: any;
    wc?: number;
    urlImages?: string[];
    avgScore?: number;
    totalReview?: number;
    schedule?: any;
    totalScore?: number;
    reviews: any;
    post_id?: number;
    avgScore1?: number;

    htotalReview?: number;
    htotalReview1?: number;
}
