import yfinance
from xml.etree import ElementTree 
from typing import List

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

    def __str__(self) -> str:
        return str(list(map(str, self.stocks)))


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
    print(getPortfolio())