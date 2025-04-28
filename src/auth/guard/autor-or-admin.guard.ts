import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, forwardRef, } from '@nestjs/common';
import { ProductosService } from 'src/productos/service/productos.service';
import { RecetasService } from 'src/recetas/service/recetas.service';


@Injectable()
export class AutorOrAdminGuard implements CanActivate {
    constructor(
        @Inject(forwardRef(() => RecetasService))
        private readonly recetasService: RecetasService,
        @Inject(forwardRef(() => ProductosService))
        private readonly productosService: ProductosService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        const id = +req.params.id;

        let recurso: any;

        if (req.baseUrl.includes('/recetas')) {
            recurso = await this.recetasService.findOne(id);
        } else if (req.baseUrl.includes('/productos')) {
            recurso = await this.productosService.findOne(id);
        }

        if (!recurso) {
            throw new ForbiddenException('Recurso no encontrado');
        }

        const isAutor = recurso.usuario?.id === user.id;
        const isAdmin = user.rol === 'admin';

        if (!isAutor && !isAdmin) {
            throw new ForbiddenException('No tienes permiso para esta acción');
        }

        return true;
    }
}
