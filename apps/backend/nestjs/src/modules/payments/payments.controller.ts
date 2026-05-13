import { Controller, Post, Get, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { PaymentProvider } from './entities/payment.entity';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Payments')
@ApiBearerAuth('access-token')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Initiate payment for a booking' })
  async initiate(@Body() dto: InitiatePaymentDto) {
    return this.paymentsService.initiatePayment(dto.bookingId, dto.provider);
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'Get payments for a booking' })
  async findByBooking(@Param('bookingId', ParseUUIDPipe) bookingId: string) {
    return this.paymentsService.findByBooking(bookingId);
  }

  @Public()
  @Post('callback/:provider')
  @ApiOperation({ summary: 'Handle payment provider callback/webhook' })
  @ApiBearerAuth()
  async handleCallback(
    @Param('provider') provider: PaymentProvider,
    @Body() payload: any,
  ) {
    return this.paymentsService.handleCallback(provider, payload);
  }
}
