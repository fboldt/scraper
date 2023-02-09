import requests

def buscaDogsAPI():
    request = requests.get("http://localhost:3002")
    print(request.content)
buscaDogsAPI()
    
