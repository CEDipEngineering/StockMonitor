from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pyparsing import original_text_for

app = FastAPI()

origins = [
    'htpp://localhost:3000', 
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