
import { Controller, Post, Body, Get } from '@nestjs/common';
import { ImagenesService } from './imagenes.service';
import { CreateImagenDto } from './dto/create-imagen.dto';

@Controller('imagenes')
export class ImagenesController {
    constructor(private readonly imagenesService: ImagenesService) { }

    @Post()
    create(@Body() dto: CreateImagenDto) {
        return this.imagenesService.create(dto);
    }

    @Get()
    findAll() {
        return this.imagenesService.findAll();
    }
}
