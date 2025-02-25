import { z } from 'zod';
import { UITest } from './base';

export class CryptoGetRatesTest extends UITest {
  currencyPairs: CurrencyPair[];
  constructor() {
    super();
    this._modelName = 'gpt-4o-mini';
    this.currencyPairs = [
      { from: 'BTC', to: 'SGD' },
      { from: 'DOT', to: 'SGD' },
      { from: 'ETH', to: 'SGD' },
      { from: 'ADA', to: 'SGD' },
      { from: 'UNI', to: 'SGD' },
    ];
  }

  async run() {
    const rates: Rate[] = [];

    for (const currencyPair of this.currencyPairs) {
      await this.page.goto(this.getUrl(currencyPair));
      await this.act;
      const rate: Rate = await this.extract({
        instruction: `get the value of 1 ${currencyPair.from} in ${currencyPair.to}, waiting for the chart to settle and the currencies to be loaded.`,
        schema: rateSchema,
      });
      console.log(
        `Extracted the exchange rate from ${currencyPair.from} to ${currencyPair.to}`
      );

      const date = new Date();
      // post the rate to the google sheet
      const res = await fetch(
        'https://script.google.com/macros/s/AKfycbzDrG7yr2Yvwq5OCY5in6ROd_dJo-xCHP5iXn0WjZxrJSIISnhNy2uBSGdOGnMnyPU/exec',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: date
              .toLocaleString('en-US', {
                timeZone: 'Asia/Singapore',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
              .split('/')
              .reverse()
              .join('-'),

            time: date.toLocaleString('en-US', {
              timeZone: 'Asia/Singapore',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
            fromCurrency: currencyPair.from,
            toCurrency: currencyPair.to,
            rate: rate.rate,
          }),
        }
      );
      const resBody = await res.json();
      if (resBody.status === 'error') {
        console.log(`Res:
  - status code: ${res.status}
  - status text: ${await res.text()}`);
        throw new Error(`Error: ${resBody.message}`);
      }
      // add to array
      rates.push(rate);
    }
    this.page.close();
    console.log(JSON.stringify(rates, null, 2));
  }
  private getUrl(currencyPair: CurrencyPair) {
    const url = `https://www.xe.com/currencycharts/?from=${currencyPair.from}&to=${currencyPair.to}`;
    return url;
  }
}

type Currency = string;

interface CurrencyPair {
  from: Currency;
  to: Currency;
}

const rateSchema = z.object({
  fromCurrency: z
    .string()
    .describe('The 3 letter code of the currency to convert from'),
  toCurrency: z
    .string()
    .describe('The 3 letter code of the currency to convert to'),
  rate: z.number().describe('The value of 1 unit of `from` in `to`'),
});

type Rate = z.infer<typeof rateSchema>;
