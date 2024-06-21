import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Genre } from "../../../models/genre.model";
import { GenreService } from "../../../services/genre.service";
import { inject } from "@angular/core";

export const genreResolver: ResolveFn<Genre> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(GenreService).findById(route.paramMap.get('id')!);
    }