import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Manga } from "../../../models/manga.model";
import { MangaService } from "../../../services/manga.service";
import { inject } from "@angular/core";

export const mangaResolver: ResolveFn<Manga> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(MangaService).findById(route.paramMap.get('id')!);
    }