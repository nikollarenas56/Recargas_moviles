import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RechargesService } from './recharges.service';
import { CreateRechargeDto } from './dto/create-recharge.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('recharges')
@UseGuards(JwtAuthGuard)
export class RechargesController {
  constructor(private readonly rechargesService: RechargesService) {}

  @Post('buy')
  @HttpCode(HttpStatus.CREATED)
  async buy(
    @Body() createRechargeDto: CreateRechargeDto,
    @GetUser('id') userId: number,
  ) {
    return this.rechargesService.buyRecharge(createRechargeDto, userId);
  }

  @Get('history')
  async getHistory(@GetUser('id') userId: number) {
    return this.rechargesService.getHistory(userId);
  }
}
