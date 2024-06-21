import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { City } from "../../../models/city.model";
import { CityService } from "../../../services/city.service";
import { inject } from "@angular/core";

export const cityResolver: ResolveFn<City> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(CityService).findById(route.paramMap.get('id')!);
    }