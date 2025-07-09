import { Injectable } from '@nestjs/common';
import xMoneyApiClient from '@xmoney/api-sdk';
import { CheckoutInitializationBodyDto, PaymentConfirmBodyDto } from './dtos';
import {
  OrderOutputDto,
  xMoneyOrderDecryptResponseDto,
} from '@xmoney/api-sdk/lib/typings/dtos';
import {
  FiatCurrenciesEnum,
  ThemeEnum,
  xMoneyCardTransactionModeEnum,
  xMoneyOrderTypeEnum,
  xMoneyTransactionMethodEnum,
  xMoneyTransactionStatusEnum,
} from '@xmoney/api-sdk/lib/typings/enums';

@Injectable()
export class AppService {
  private xMoneyApiClient: xMoneyApiClient;

  constructor() {
    this.xMoneyApiClient = new xMoneyApiClient({
      secretKey: 'sk_test_',
      verbose: true,
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
      cardId: checkoutBody.cardId,
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
      customData: checkoutBody.customData,
      cardTransactionMode: 'authAndCapture',
      saveCard: true,
      backUrl: 'https://localhost:3002/transaction-result',
    });

    return payload;
  }

  async checkoutInitializationStandalonePage(
    checkoutBody: CheckoutInitializationBodyDto,
    xMoneyCustomerId?: number,
  ): Promise<any> {
    // You can use user data from checkoutBody
    // Or fetch them from your database
    const customer = await this.getCustomerData('customerId1');

    // Fetch order details from your database
    const order = await this.getOrderData(`orderId1-${Date.now()}`);

    const payload = this.xMoneyApiClient.getWebviewCheckoutHtml(
      {
        publicKey: checkoutBody.publicKey,
        cardId: checkoutBody.cardId,
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
        customData: checkoutBody.customData,
        cardTransactionMode: 'authAndCapture',
        saveCard: true,
        backUrl: 'https://localhost:3002/transaction-result',
      },
      ThemeEnum.Light,
      xMoneyCustomerId,
    );

    return payload;
  }

  async saveCardInitialization(
    _checkoutBody: CheckoutInitializationBodyDto,
  ): Promise<void> {
    // Fetch order details from your database
    const order = await this.getOrderData(`orderId1-${Date.now()}`);

    const response = await this.xMoneyApiClient.initializeCheckoutWithSavedCard(
      {
        customerId: 61433,
        ip: '128.1.1.1',
        currency: FiatCurrenciesEnum.EUR,
        externalOrderId: order.id,
        amount: 10,
        orderType: xMoneyOrderTypeEnum.Purchase,
        transactionMethod: xMoneyTransactionMethodEnum.Card,
        cardTransactionMode: xMoneyCardTransactionModeEnum.Auth_And_Capture,
        cardId: 136097,
      },
    );
    console.log(response);
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

    console.log(JSON.stringify(paymentResponse));
    // Your business logic here
    if (
      paymentResponse.transactionStatus ===
      xMoneyTransactionStatusEnum.CompleteOk
    ) {
      console.log('Transaction was successful');
    }

    return Promise.resolve(paymentResponse);
  }

  async getCards(customerId: number) {
    return await this.xMoneyApiClient.getCards(customerId);
  }
  async getOrder(orderId: string) {
    return await this.xMoneyApiClient.getOrder(orderId);
  }
}
