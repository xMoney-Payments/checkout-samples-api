import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CheckoutInitializationBodyDto, PaymentConfirmBodyDto } from './dtos';
import {
  OrderOutputDto,
  xMoneyOrderDecryptResponseDto,
} from '@xmoney/api-sdk/lib/typings/dtos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('checkout-initialization')
  checkoutInitialization(
    @Body() checkoutBody: CheckoutInitializationBodyDto,
  ): Promise<OrderOutputDto> {
    return this.appService.checkoutInitialization(checkoutBody);
  }

  @Post('payment-confirm')
  paymentConfirm(
    @Body() paymentConfirmBody: PaymentConfirmBodyDto,
  ): Promise<xMoneyOrderDecryptResponseDto> {
    return this.appService.paymentConfirm(paymentConfirmBody);
  }
}
