Quake 3 Arena Log API
===========


[![Build Status](https://travis-ci.org/LanderMalta/quakeLogParser.svg?branch=master)](https://travis-ci.org/LanderMalta/quakeLogParser)

## Sobre
Essa é uma pequena API no modelo RESTFul desenvolvida em NodeJS com base de dados MongoDb.

## Notas 
##### Requisitos
* Node JS
* MongoDB

##### Executar o projeto
* Após clonar o projeto, instale as dependências com o comando `$ npm install`.
* Para rodar o projeto em ambiente de desenvolvimento use o comando `$ node server` ou utilize o nodemon com `$ nodemon`.
* Acesse http://localhost:3000/.
* Ao rodar o projeto, o arquivo [core/parseLog.js](core/parseLog.js) executa uma leitura no arquivo [assets/games.log](assets/games.log), extraindo suas informações e verificando qual evento ocorreu no jogo, assim os dados necessários são coletados e inseridos na base de dados para as consultas dos pontos de acesso (/games) e (/games/id).

#### JSON retornado
###### Games
* **total_kills** é a contagem de todas as mortes de cada jogo, sem exclusões.

###### Players
* **name** é o nome do jogador.

###### Kills
* **kills** é a contagem de todas as mortes causadas pelo jogador, sem exclusões.
* **deaths** é a contagem de todas a mortes do jogador (excluindo seus suicídios).
* **suicides** é a contagem de todos os suicídios do jogador, seja por dano no mapa ou que ele mesmo causou, por exemplo:
 
 Exemplo de suicídio causado pelo mapa:
```  
12:15 Kill: 1022 4 19: <world> killed Zeh by MOD_FALLING
```


Exemplo de suicídio causado pelo próprio jogador:

     
```  
12:13 Kill: 3 3 7: Dono da Bola killed Dono da Bola by MOD_ROCKET_SPLASH
```
* **score** é o calculo de **kills** menos **suicides**.

Assim, o resultado **JSON** para cada jogo é retornado da seguinte forma:

    {
        players: [
            {name: "Isgalamido"},
            {name: "Mocinha"},
            {name: "Zeh"},
            {name: "Dono da Bola"}
        ],
        kills: [
            {
                kills: 1,
                deaths: 0,
                suicides: 0,
                score: 1,
                playerName: "Isgalamido"
            },
            {
                kills: 0,
                deaths: 1,
                suicides: 0,
                score: 0,
                playerName: "Mocinha"
            },
            {
                kills: 0,
                deaths: 0,
                suicides: 2,
                score: -2,
                playerName: "Zeh"
            },
            {
                kills: 0,
                deaths: 0,
                suicides: 1,
                score: -1,
                playerName: "Dono da Bola"
            }
        ],
        _id: 2,
        total_kills: 4
    }


#### Testes
Todos os testes do projeto estão dentro da pasta test, é utilizado as dependencias mocha com chai.
Para executar a rotina de testes digite o comando:
```  
npm test
```
Os testes podem ser vistos diretamente [aqui](https://travis-ci.org/LanderMalta/quakeLogParser)
