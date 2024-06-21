import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Publisher } from "../../../models/publisher.model";
import { PublisherService } from "../../../services/publisher.service";
import { inject } from "@angular/core";

export const publisherResolver: ResolveFn<Publisher> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(PublisherService).findById(route.paramMap.get('id')!);
    }