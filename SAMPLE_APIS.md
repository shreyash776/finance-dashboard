# Sample API Endpoints for Testing

Here are some free and publicly available APIs you can use to test your Finance Dashboard widgets.

## 🪙 Cryptocurrency APIs

### CoinBase Exchange Rates
```
https://api.coinbase.com/v2/exchange-rates?currency=BTC
```
- **Type**: Card/Table Widget
- **Best Fields**: data.rates.USD, data.rates.EUR, data.currency
- **Refresh**: 30-60 seconds

### CoinGecko Price Data
```
https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=usd,eur
```
- **Type**: Chart Widget
- **Best Fields**: bitcoin.usd, ethereum.usd, cardano.usd
- **Refresh**: 60 seconds

### CryptoCompare Multi-Symbol
```
https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD,EUR
```
- **Type**: Table/Chart Widget
- **Best Fields**: BTC.USD, ETH.USD, LTC.USD
- **Refresh**: 30 seconds

## 📈 Stock Market APIs

### Alpha Vantage (Free API Key Required)
```
https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo
```
- **Type**: Card Widget  
- **Best Fields**: Global Quote.05. price, Global Quote.09. change, Global Quote.10. change percent
- **Refresh**: 300 seconds (API limits)

### Financial Modeling Prep (Free Tier)
```
https://financialmodelingprep.com/api/v3/quote/AAPL,GOOGL,MSFT?apikey=demo
```
- **Type**: Table Widget
- **Best Fields**: symbol, price, changesPercentage, dayLow, dayHigh
- **Refresh**: 60 seconds

## 🏦 Economic Data

### FRED Economic Data (API Key Required)
```
https://api.stlouisfed.org/fred/series/observations?series_id=GDP&api_key=demo&file_type=json&limit=10
```
- **Type**: Chart Widget (Time Series)
- **Best Fields**: observations[].date, observations[].value
- **Refresh**: Daily

### World Bank Data
```
https://api.worldbank.org/v2/country/US/indicator/NY.GDP.MKTP.CD?format=json&date=2020:2023
```
- **Type**: Chart Widget
- **Best Fields**: 1[].date, 1[].value
- **Refresh**: Daily

## 🌐 General APIs for Testing

### JSONPlaceholder (Test Data)
```
https://jsonplaceholder.typicode.com/posts
```
- **Type**: Table Widget
- **Best Fields**: id, title, userId
- **Refresh**: 30 seconds
- **Note**: Great for testing table functionality

### Random User Generator
```
https://randomuser.me/api/?results=10
```
- **Type**: Table Widget
- **Best Fields**: results[].name.first, results[].name.last, results[].email
- **Refresh**: 60 seconds

### HTTP Cats (Fun API)
```
https://http.cat/200.jpg
```
- **Type**: Card Widget (Image URL)
- **Best Fields**: Direct image URL
- **Refresh**: 300 seconds

## 💱 Exchange Rates

### Fixer.io (Free Tier Available)
```
https://api.fixer.io/latest?access_key=YOUR_API_KEY&base=USD&symbols=EUR,GBP,JPY
```
- **Type**: Card/Chart Widget
- **Best Fields**: rates.EUR, rates.GBP, rates.JPY
- **Refresh**: 60 seconds

### ExchangeRate-API (Free)
```
https://api.exchangerate-api.com/v4/latest/USD
```
- **Type**: Table Widget
- **Best Fields**: rates.EUR, rates.GBP, rates.JPY, rates.CNY
- **Refresh**: 300 seconds

## 🎯 Recommended Test Sequence

### 1. Start with CoinBase (No API Key Required)
```javascript
{
  "name": "Bitcoin Exchange Rates",
  "apiUrl": "https://api.coinbase.com/v2/exchange-rates?currency=BTC",
  "displayMode": "card",
  "selectedFields": ["data.currency", "data.rates.USD", "data.rates.EUR", "data.rates.GBP"],
  "refreshInterval": 60
}
```

### 2. Test Table View with JSONPlaceholder
```javascript
{
  "name": "Sample Posts Table",
  "apiUrl": "https://jsonplaceholder.typicode.com/posts",
  "displayMode": "table",
  "selectedFields": ["id", "title", "userId", "body"],
  "showArraysOnly": true,
  "refreshInterval": 120
}
```

### 3. Test Chart with CoinGecko
```javascript
{
  "name": "Crypto Price Chart",
  "apiUrl": "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=usd",
  "displayMode": "chart",
  "chartType": "bar",
  "selectedFields": ["bitcoin.usd", "ethereum.usd", "cardano.usd"],
  "refreshInterval": 60
}
```

## 🔑 Getting Free API Keys

### Alpha Vantage
1. Visit: https://www.alphavantage.co/support/#api-key
2. Sign up for free account
3. Get API key (500 requests/day free)

### CryptoCompare  
1. Visit: https://www.cryptocompare.com/cryptopian/api-keys
2. Sign up for free account
3. Get API key (100,000 requests/month free)

### FRED (Federal Reserve Economic Data)
1. Visit: https://fredaccount.stlouisfed.org/apikeys
2. Create free account
3. Request API key (unlimited for non-commercial use)

## ⚠️ API Usage Notes

- **Rate Limits**: Respect API rate limits to avoid being blocked
- **CORS**: All APIs are proxied through the Next.js backend to handle CORS
- **Error Handling**: The dashboard gracefully handles API errors and timeouts
- **Caching**: Consider implementing caching for frequently requested data
- **API Keys**: Store API keys securely using environment variables

---

**Happy Testing! 🚀**
