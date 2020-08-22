### Avaliação Hellper
    Segue meu projeto crud de usuarios, onde é possivel incluir, pesquisar, alterar e deletar usuarios,
    o projeto disponibiliza tambem a criação de usuários administradores que são autorizados via token a consumir os serviços.
    O projeto esta no Docker Hub disponivel atraves da comando docker pull williancarlos/crus-user-helpper
    Ou suba minha aplicação no docker utilizando o docker-compose pois nele esta todas as configurações necessárias para subir o serviço. 

### Rodando o projeto

`docker-compose up`

apos executar o comando e subir o serviço é so acessar o endereço http://localhost:5000/documentation que as apis estarão disponiveis para uso.

### rodando os testes

    No docker-compose esta comentando o comando que realiza chamada aos scripts de testes
    os testes abrangem : 
    -Conexão com o Banco de Dados Postgres
    -inclução de novo usuario
    -alteração e delete
    - testes de rotas 