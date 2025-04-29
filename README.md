# xMoney Checkout API Sample

This is a sample API implementation demonstrating how to integrate with the xMoney payment gateway using the official SDK. The project is built with NestJS and TypeScript.

## Features

- Checkout initialization endpoint
- Payment confirmation endpoint
- Integration with XMoney API SDK
- TypeScript support with proper type definitions
- Built-in validation using class-validator

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- xMoney API credentials (public and secret keys)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd checkout-samples-api
```

2. Install dependencies:
```bash
npm install
```

## Configuration

The API uses the xMoney API SDK which requires a secret key. In this sample, a test key is used:

```typescript
secretKey: 'sk_test_a55af115af6ae1fd6a38f3602e9d40d4'
```

For production use, replace this with your actual secret key.

## API Endpoints

### 1. Initialize Checkout

**Endpoint:** `POST /checkout-initializion`

**Request Body:**
```typescript
{
  publicKey: string;
  amount: number;
  currency: string;
  firstName: string;
  lastName: string;
  email: string;
  cardName: string;
}
```

**Response:**
Returns an `OrderOutputDto` containing the checkout initialization data.

### 2. Confirm Payment

**Endpoint:** `POST /payment-confirm`

**Request Body:**
```typescript
{
  result: string; // Encrypted payment result from XMoney
}
```

**Response:**
Returns the decrypted payment response with transaction status and details.

## Development

Run the development server:

```bash
npm run start:dev
```

## Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start the application in development mode with hot-reload
- `npm run start:debug` - Start the application in debug mode
- `npm run start:prod` - Start the application in production mode
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage

## Testing

The project includes Jest for testing. Run tests using:

```bash
npm run test
```

For end-to-end tests:

```bash
npm run test:e2e
```

## Security

- Always use environment variables for sensitive data in production
- Never commit API keys to version control
- Use HTTPS in production
- Implement proper error handling and logging

## License

This project is unlicensed. See the LICENSE file for details.

## Support

For support with the xMoney API, please refer to https://docs.xmoney.com or contact our support team.
