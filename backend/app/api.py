from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.Stocks import *

app = FastAPI()
pf = getPortfolio()


origins = [
    'http://localhost:3000', 
    'localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get('/', tags=['root'])
async def read_root() -> dict:
    return {"message": "Hellow World"}

@app.get('/data', tags='data')
async def get_data() -> dict:
    return pf.get_values()

@app.get('/history', tags=['history'])
async def get_history(key: str = None) -> dict:
    if key is None:
        return {"data":pf.get_stock_names()}
    if not pf.validate_key(key): return None
    return pf.get_history(key)

@app.get('/details')
async def get_details(key: str):
    if not pf.validate_key(key): return None
    return pf.get_details(key)

@app.get('/portfolio/worth')
async def get_worth() -> dict:
    return pf.get_full_worth_history()