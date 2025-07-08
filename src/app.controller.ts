import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Post('checkout-initialization-standalone')
  checkoutInitializationStandalone(
    @Body() checkoutBody: CheckoutInitializationBodyDto,
  ): Promise<OrderOutputDto> {
    // provide xmoneycustomerid as a second argument if you want cards to be shown
    return this.appService.checkoutInitializationStandalonePage(checkoutBody);
  }

  @Post('save-card-initialization')
  async saveCardInitialization(
    @Body() checkoutBody: CheckoutInitializationBodyDto,
  ): Promise<void> {
    await this.appService.saveCardInitialization(checkoutBody);
  }

  @Post('payment-confirm')
  paymentConfirm(
    @Body() paymentConfirmBody: PaymentConfirmBodyDto,
  ): Promise<xMoneyOrderDecryptResponseDto> {
    return this.appService.paymentConfirm(paymentConfirmBody);
  }

  @Post('order-saved-card')
  orderSavedCard(@Body() paymentConfirmBody) {
    return this.appService.saveCardInitialization(paymentConfirmBody);
  }

  @Get('saved-cards/:xMoneyCustomerId')
  async getCards(
    @Param('xMoneyCustomerId') xMoneyCustomerId: number,
  ): Promise<any> {
    return await this.appService.getCards(xMoneyCustomerId);
  }

  @Get('order/:id')
  async getOrder(@Param('id') orderId: string): Promise<any> {
    return await this.appService.getOrder(orderId);
  }
}
