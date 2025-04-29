import { Injectable } from '@nestjs/common';
import xMoneyApiClient from '@xmoney/api-sdk';
import { CheckoutInitializationBodyDto, PaymentConfirmBodyDto } from './dtos';
import {
  OrderOutputDto,
  xMoneyOrderDecryptResponseDto,
} from '@xmoney/api-sdk/lib/typings/dtos';
import { xMoneyTransactionStatusEnum } from '@xmoney/api-sdk/lib/typings/enums';

@Injectable()
export class AppService {
  private xMoneyApiClient: xMoneyApiClient;

  constructor() {
    this.xMoneyApiClient = new xMoneyApiClient({
      secretKey: 'sk_test_a55af115af6ae1fd6a38f3602e9d40d4',
    });
  }

  async checkoutInitialization(
    checkoutBody: CheckoutInitializationBodyDto,
  ): Promise<OrderOutputDto> {
    // You can use user data from checkoutBody
    // Or fetch them from your database
    const customer = await this.getCustomerData('customerId1');

    // Fetch order details from your database
    const order = await this.getOrderData(`orderId1-${Date.now()}`);

    const payload = this.xMoneyApiClient.initializeCheckout({
      publicKey: checkoutBody.publicKey,
      customer: {
        identifier: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        country: customer.country,
        city: customer.city,
        email: customer.email,
      },
      order: {
        orderId: order.id,
        description: order.description,
        type: 'purchase',
        amount: checkoutBody.amount, // from req body
        currency: checkoutBody.currency, // from req body
      },
      cardTransactionMode: 'authAndCapture',
      backUrl: 'https://localhost:3002/transaction-result',
    });

    return payload;
  }

  private async getCustomerData(customerId: string) {
    return Promise.resolve({
      id: customerId,
      firstName: 'John',
      lastName: 'Doe',
      country: 'RO',
      city: 'Bucharest',
      email: 'john.doe@xmoney.com',
    });
  }

  private async getOrderData(orderId: string) {
    return Promise.resolve({
      id: orderId,
      description: 'My first purchase',
    });
  }

  async paymentConfirm(
    body: PaymentConfirmBodyDto,
  ): Promise<xMoneyOrderDecryptResponseDto> {
    const paymentResponse = this.xMoneyApiClient.decryptOrderResponse(
      body.result,
    );

    // Your business logic here
    if (
      paymentResponse.transactionStatus ===
      xMoneyTransactionStatusEnum.CompleteOk
    ) {
      console.log('Transaction was successful');
    }

    return Promise.resolve(paymentResponse);
  }
}
