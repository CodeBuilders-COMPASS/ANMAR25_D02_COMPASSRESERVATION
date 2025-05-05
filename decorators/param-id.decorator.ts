import { Param, ParseIntPipe } from '@nestjs/common';

export const ParamId = (param: string = 'id') => Param(param, ParseIntPipe);


