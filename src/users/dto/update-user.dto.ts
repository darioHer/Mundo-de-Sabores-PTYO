import { IsOptional, IsEmail, MinLength, IsString, IsDateString, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @MinLength(8)
    password?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    nombres?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    apellidos?: string;

    @IsOptional()
    @IsDateString()
    fechaNacimiento?: string; 

    @IsOptional()
    @IsString()
    biografia?: string;
}
