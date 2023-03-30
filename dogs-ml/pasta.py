import requests
import os

def main():
    # quantidade de imagens por pasta
    qtd = 200

    # pega os nomes da API de lista
    url = 'https://dog.ceo/api/breed/wolfhound/irish/images'
    racas_json = requests.get(url).json()
    racas_json = racas_json['message']

    # separa as imagens por nome
    for key, value in racas_json.items():

        if (value):
            for name_value in value:
                url = 'https://dog.ceo/api/breed/' + key + '/' + \
                    name_value + '/images/random/' + str(qtd)
                try:
                    img = requests.get(url).json()
                    download(key, name_value, img)
                except:
                    print("Erro ao obter as imagens da sub-raça " + name_value)
        else:
            # pega imagem de raça
            url = 'https://dog.ceo/api/breed/' + \
                key + '/images/random/' + str(qtd)
            try:
                img = requests.get(url).json()
                download(key, '', img)
            except:
                print("Erro ao obter as imagens da raça " + key)

# download das raças e sub raças
def download(name, subname, req):
    url = req['message']
    if (req['status'] == 'success'):

        # verifica se é raca ou subraca
        if (subname != ''):
            subname = '-' + subname

        # cria pasta se não existir
        if (not os.path.exists(name + subname)):
            os.makedirs(name + subname)

        for link in url:
            try:
                img = requests.get(link)

                # nome da imagem.jpg
                name_file = 'https://images.dog.ceo/breeds/' + name + subname + '/'
                name_file = link[len(name_file)::]

                # salva imagem
                with open(name + subname + '/' + name_file, 'wb') as file:
                    file.write(img.content)
            except:
                print("Erro ao baixar a imagem " + link)

main()
