import { IsInt, IsNotEmpty } from 'class-validator';

export class CancelReservationDto {
  @IsInt()
  @IsNotEmpty()
  id: number; // ID da reserva que será cancelada
}
