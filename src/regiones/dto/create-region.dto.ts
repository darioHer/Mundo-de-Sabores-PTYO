import { IsNotEmpty } from "class-validator";

export class CreateRegionDto {
    @IsNotEmpty()
    nombre: string;
}