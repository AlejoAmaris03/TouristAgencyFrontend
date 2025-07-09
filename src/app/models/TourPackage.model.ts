import { TouristServiceModel } from "./TouristService.model";

export interface TourPackageModel {
    id: number;
    name: string;
    price: number;
    touristServices: TouristServiceModel[]
}