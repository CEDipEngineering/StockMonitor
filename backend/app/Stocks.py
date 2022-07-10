import yfinance as yf
from xml.etree import ElementTree 
from typing import List
import json
import pandas as pd
from datetime import datetime, timedelta
import numpy as np
import pickle as pkl

class Stock:
    def __init__(self, name: str, key: str, amount: int, investment: float):
        self.name = name
        self.key = key
        self.amount = amount
        self.investment = investment
        self.purchasePrice = investment/amount

    def __str__(self) -> str:
        # Use name if available, else use key
        return "There are {1} stocks of {0}".format(self.name if not self.name == "" else self.key, self.amount)

class Portfolio:
    FORCE_FETCH = False
    def __init__(self, stockList: List[Stock]):
        self.stocks = stockList
        self.stockDict = dict() # Access by key
        self.seriesDict = dict()
        for s in self.stocks:
            self.stockDict[s.key] = s 
        self.history = self.build_history()
        self.percentageHistoryDict = self.build_percentages()

    def build_percentages(self):
        values = dict()
        for s in self.stocks:
            values[s.key] = self.seriesDict[s.key]['Close']*s.purchasePrice
        self.valueHistory = values
        df = pd.DataFrame(data=self.valueHistory)
        df = df.div(df.sum(axis=1), axis=0)
        return df.to_dict(orient='list')

    def get_values(self):
        out = []
        for s in self.stocks:
            out.append({
                'name':s.name,
                'key':s.key,
                'amount':str(s.amount),
                'investment':str(s.investment),
                'purchasePrice':str(s.purchasePrice)
            })
        return out

    def __str__(self) -> str:
        return str(list(map(str, self.stocks)))

    def fetch_data(self):
        keys = self.get_stock_names()
        tik = yf.Tickers(tickers=keys)
        out = dict()
        for k in keys:
            t = tik.tickers[k]
            series = t.history('3y')[['Close']]
            series['Close'] = series['Close'].apply(lambda x: float(f"{x:.03f}"))
            series['Day'] = series.index#.strftime(r"%Y-%m-%d")
            series['Avg'] = series['Close'].rolling(window=10).mean()
            series = series.dropna(axis=0)
            self.seriesDict[k] = series.copy()
            result = series.to_json(orient="records")
            parsed = json.loads(result)
            out[k] = parsed
        now = datetime.now()
        out['Timestamp'] = now
        out['Series'] = self.seriesDict
        return out

    def build_history(self):
        try:
            # Read cache
            with open('./app/cached.pickle', 'rb') as f:
                obj = pkl.load(f)
            self.seriesDict = obj.pop("Series")
            last_fetch_time = obj.pop('Timestamp') # datetime.strptime(obj.pop('Timestamp'), r"%Y-%m-%d %H:%M:%S.%f") # Not necessary to parse, pickle stores it as a date!
            current_time = datetime.now()
            diff = current_time-last_fetch_time
            # Been over an hour since last fetch
            if diff>timedelta(hours=1) or Portfolio.FORCE_FETCH:
                data = self.fetch_data()
                with open("./app/cached.pickle", 'wb') as f:
                    pkl.dump(data, f)
                data.pop('Timestamp')
                return data
            return obj
        except FileNotFoundError:
            # Cache not found, fetch data from scratch
            data = self.fetch_data()
            with open("./app/cached.pickle", 'wb') as f:
                pkl.dump(data, f)
            data.pop('Timestamp')
            return data

    def get_history(self, key):
        return self.history[key]

    def get_percentage_history(self, key):
        return self.percentageHistoryDict[key]

    def get_stock_names(self):
        return list(map(lambda x: x.key, self.stocks))

    def get_details(self, key):
        stock: Stock = self.stockDict[key]
        purchase_date = self.estimate_purchase_time(key)
        profit = self.calculateProfit(key)
        value = self.get_current_value(key)
        percent = self.get_current_percentage_worth(key)
        out_json = {"Name": stock.name,
                    "PurchasePrice": stock.purchasePrice,
                    "Investment": stock.investment,
                    "Amount": stock.amount,
                    "Key": stock.key,
                    "PurchaseDate": purchase_date,
                    "Profit": profit,
                    "CurrentValue": value,
                    "PercentageWorth": percent}
        print(out_json)
        return out_json

    def get_current_value(self, key):
        series = self.seriesDict[key]
        curr_value = series.sort_values('Day', ascending=False).reset_index()["Close"][0]
        return curr_value

    def get_current_percentage_worth(self, key):
        return self.get_percentage_history(key)[-1]

    def calculateProfit(self, key):
        stock: Stock = self.stockDict[key]
        curr_value = self.get_current_value(key)
        profit = curr_value/stock.purchasePrice
        return profit

    def estimate_purchase_time(self, key):
        series = self.seriesDict[key]
        series['Day'] = pd.to_datetime(series['Day'], unit='ms') # Convert back to days
        series = series[(series['Day'] < datetime(2020, 4, 1)) & (series['Day'] > datetime(2020, 2, 1))]
        price = self.stockDict[key].purchasePrice
        xp = series['Close']
        fp = series['Day'].to_list()
        index = np.argmin((xp-price).abs())
        result = pd.Series([fp[index]]).to_json()
        parsed = json.loads(result)      
        return parsed["0"]

    def validate_key(self, key):
        return key in self.stockDict.keys()

def getPortfolio(fileName: str = "../env/stocks.xml") -> Portfolio:
    tree = ElementTree.parse(fileName)
    root = tree.getroot()
    
    stocks = []
    for child in root:
        name = child.find('name').text 
        key = child.find('key').text
        amount = int(child.find('amount').text)
        investment = float(child.find('investment').text)
        stocks.append(Stock(name, key, amount, investment))
    
    return Portfolio(stocks)

if __name__ == "__main__":
    p = getPortfolio()
    p.get_history("ITSA4.SA")