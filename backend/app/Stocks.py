import yfinance as yf
from xml.etree import ElementTree 
from typing import List
import json

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
    def __init__(self, stockList: List[Stock]):
        self.stocks = stockList

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

    def get_history(self):
        keys=list(map(lambda x: x.key, self.stocks))
        tik = yf.Tickers(tickers=keys)
        t = tik.tickers[keys[0]]
        series = t.history('6mo')[['Close']]
        series['Close'] = series['Close'].apply(lambda x: float(f"{x:.03f}"))
        series['Day'] = series.index#.strftime(r"%Y-%m-%d")
        result = series.to_json(orient="records")
        parsed = json.loads(result)
        return parsed

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
    p.get_history()