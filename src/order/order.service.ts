import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dtos/create-order.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe')(
  'sk_test_51MoELVIKyDCqLTCrTSGScHAnyU4bkNNxZq6eJJky0t5Uem7zz6uhtjMrS1R3Gw75x2zzYymXFX9WwvyckNKqNGgm00aKssCNvV',
);

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async getOrder(userId: number) {
    return await this.prisma.order.findFirst({
      where: { userId },
    });
  }

  async createOrders(createOrder: CreateOrderDto, email: string) {
    const { items } = createOrder;
    console.log(items);

    let orderItems = items.map(async (item) => {
      return await this.prisma.post.findUnique({
        where: {
          id: item.id,
        },
        select: {
          pname: true,
          price: true,
        },
      });
    });

    orderItems = await Promise.all(orderItems);
    let emailRecipt = '';
    orderItems = orderItems.map((item: any, index: number) => {
      emailRecipt = emailRecipt.concat(item.pname, item.price, ' $\n');
      return { ...item, quantity: items[index].quantity };
    });

    // console.log(orderItems);
    let paymentRes;
    if (createOrder.payement === 'card') {
      paymentRes = await this.payByCard(orderItems);
      if (paymentRes) {
        this.emailService.sendPlainEmail(
          email,
          'Order Recipt',
          `${emailRecipt}` +
            '\n Total Price: ' +
            `${paymentRes.amount_total} $`,
        );
        return paymentRes.url;
      }
    }

    return false;
  }

  async payByCard(items) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => {
        console.log(item);
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.pname,
            },
            unit_amount: item.price,
          },
          quantity: item.quantity,
        };
      }),

      mode: 'payment',
      payment_intent_data: {
        setup_future_usage: 'on_session',
      },
      success_url: 'http://localhost:3000/email',
      cancel_url: 'http://localhost:3000/order',
    });
    // console.log(session);
    return session;
  }
}
