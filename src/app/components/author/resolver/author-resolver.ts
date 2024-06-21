import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Author } from "../../../models/author.model";
import { AuthorService } from "../../../services/author.service";
import { inject } from "@angular/core";

export const authorResolver: ResolveFn<Author> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(AuthorService).findById(route.paramMap.get('id')!);
    }