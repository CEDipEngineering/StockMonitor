from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pyparsing import original_text_for
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
async def get_history() -> dict:
    return pf.get_history()