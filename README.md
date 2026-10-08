# 🪙 Sistema de Moeda Estudantil

Sistema para estimular o reconhecimento do mérito estudantil por meio de uma moeda virtual: professores distribuem moedas aos alunos como reconhecimento, e os alunos trocam essas moedas por produtos e descontos oferecidos por empresas parceiras.

> 📚 Projeto desenvolvido para a disciplina **Laboratório de Projeto de Software** — PUC Minas, 2º semestre/2026
>
> 👩‍🏫 Profa. Milena Menezes Adão

---

## 📌 Sumário

- [📖 Sobre](#-sobre)
- [🎯 Objetivo](#-objetivo)
- [👥 Atores](#-atores)
- [🗂️ Casos de Uso](#️-casos-de-uso)
- [📝 Histórias de Usuário](#-histórias-de-usuário)
- [⚙️ Regras de Negócio](#️-regras-de-negócio)
- [🗺️ Diagrama de Caso de Uso](#️-diagrama-de-caso-de-uso)
- [🧩 Diagrama de Classes](#-diagrama-de-classes)
- [🏗️ Diagrama de Componentes](#️-diagrama-de-componentes)
- [🚀 Status do Projeto](#-status-do-projeto)
- [✍️ Autores](#️-autores)

---

## 📖 Sobre

O **Sistema de Moeda Estudantil** é uma plataforma de reconhecimento de mérito acadêmico baseada em uma moeda virtual. A cada semestre, professores vinculados às instituições parceiras recebem um montante de moedas que podem distribuir aos seus alunos por bom comportamento, participação em aula e outros motivos. Os alunos acumulam essas moedas e as trocam por vantagens cadastradas por empresas parceiras, como descontos em restaurantes da universidade, desconto de mensalidade ou compra de materiais específicos.

O sistema conecta três perfis de usuário: aluno, professor e empresa parceira. Possui integração a um serviço de envio de emails, responsável por notificar o recebimento de moedas e por entregar os cupons de resgate.

## 🎯 Objetivo

Fornecer uma solução centralizada que permita:

- ✅ Cadastrar alunos e empresas parceiras no sistema de mérito
- ✅ Creditar semestralmente moedas aos professores, de forma acumulável
- ✅ Permitir que professores reconheçam alunos com envio de moedas e motivo obrigatório
- ✅ Notificar o aluno por email a cada reconhecimento recebido
- ✅ Permitir a consulta de extrato de conta por professores e alunos
- ✅ Permitir que empresas parceiras cadastrem vantagens com descrição, foto e custo em moedas
- ✅ Permitir que alunos resgatem vantagens, debitando o valor do seu saldo
- ✅ Gerar e enviar por email o código do cupom ao aluno e ao parceiro, para conferência da troca
- ✅ Garantir o acesso autenticado de todos os perfis de usuário

## 👥 Atores

| Ator | Descrição |
|---|---|
| 🎒 **Aluno** | Realiza seu próprio cadastro, consulta extrato e troca moedas por vantagens |
| 👩‍🏫 **Professor** | Pré-cadastrado pela instituição; distribui moedas aos alunos e consulta seu extrato |
| 🏢 **Empresa Parceira** | Realiza seu cadastro e mantém as vantagens oferecidas aos alunos |
| 🏫 **Instituição de Ensino** | Pré-cadastrada no sistema; envia a lista de professores no momento da parceria |
| 📧 **Serviço de Email** *(externo)* | Recebe as solicitações de envio de notificações e de cupons de resgate |

## 🗂️ Casos de Uso

### 🔑 Comuns a todos os perfis

| Caso de uso | Ator | Descrição |
|---|---|---|
| **UC01** — Autenticar no sistema | Aluno, Professor, Empresa Parceira | Acessa o sistema por meio de login e senha |

> ℹ️ Todos os casos de uso a seguir incluem o **UC01 — Autenticar no sistema** (relacionamento `«include»`), com exceção dos cadastros iniciais (**UC02** e **UC07**), que precedem a existência da conta.

### 🎒 Aluno

| Caso de uso | Descrição |
|---|---|
| **UC02** — Cadastrar-se como aluno | Informa nome, email, CPF, RG, endereço, login e senha, e seleciona a instituição de ensino e o curso |
| **UC03** — Consultar extrato da conta | Visualiza o saldo atual de moedas e o histórico de recebimentos e trocas |
| **UC04** — Consultar vantagens disponíveis | Lista as vantagens cadastradas pelas empresas parceiras, com descrição, foto e custo |
| **UC05** — Resgatar vantagem | Seleciona uma vantagem, tem o custo debitado do saldo e recebe o cupom por email |
| **UC06** — Receber notificação de moedas | É notificado por email sempre que um professor lhe envia moedas |

### 👩‍🏫 Professor

| Caso de uso | Descrição |
|---|---|
| **UC07** — Enviar moedas a um aluno | Seleciona o aluno, informa o montante e o motivo do reconhecimento |
| **UC08** — Consultar extrato da conta | Visualiza o saldo atual de moedas e o histórico de envios realizados |

### 🏢 Empresa Parceira

| Caso de uso | Descrição |
|---|---|
| **UC09** — Cadastrar-se como empresa parceira | Informa os dados da empresa, login e senha |
| **UC10** — Manter vantagens | Cadastra, altera e remove vantagens, informando descrição, foto e custo em moedas |
| **UC11** — Receber comprovante de resgate | Recebe por email o código do cupom resgatado, para conferência da troca presencial |

### ⚙️ Casos de uso do sistema

| Caso de uso | Descrição |
|---|---|
| **UC12** — Creditar moedas semestrais aos professores | A cada semestre, adiciona 1.000 moedas ao saldo corrente de cada professor |
| **UC13** — Gerar código de cupom | Gera o código que identifica o resgate e é enviado ao aluno e ao parceiro |
| **UC14** — Enviar email | Aciona o serviço externo de email para notificações e cupons |

## 📝 Histórias de Usuário

### 🎒 Aluno

- Como aluno, quero me cadastrar no sistema informando meus dados pessoais e selecionando minha instituição e curso, para poder participar do sistema de mérito.
- Como aluno, quero fazer login no sistema, para acessar minhas funcionalidades com segurança.
- Como aluno, quero ser notificado por email quando receber moedas, para saber que fui reconhecido e por qual motivo.
- Como aluno, quero consultar o extrato da minha conta, para visualizar meu saldo de moedas e as transações que realizei.
- Como aluno, quero visualizar as vantagens disponíveis com descrição, foto e custo, para decidir no que gastar minhas moedas.
- Como aluno, quero resgatar uma vantagem usando meu saldo, para aproveitar o benefício oferecido pela empresa parceira.
- Como aluno, quero receber por email um cupom com código após o resgate, para utilizá-lo na troca presencial.

### 👩‍🏫 Professor

- Como professor, quero fazer login no sistema, para acessar minhas funcionalidades.
- Como professor, quero receber 1.000 moedas a cada semestre, de forma acumulável, para ter como reconhecer meus alunos ao longo do curso.
- Como professor, quero enviar moedas a um aluno informando o motivo do reconhecimento, para valorizar seu bom comportamento e participação em aula.
- Como professor, quero consultar o extrato da minha conta, para acompanhar meu saldo e os envios que já realizei.

### 🏢 Empresa Parceira

- Como empresa parceira, quero me cadastrar no sistema, para oferecer vantagens aos alunos participantes.
- Como empresa parceira, quero cadastrar vantagens com descrição, foto e custo em moedas, para divulgar o que ofereço aos alunos.
- Como empresa parceira, quero alterar e remover as vantagens que cadastrei, para manter minhas ofertas atualizadas.
- Como empresa parceira, quero receber por email o código do cupom resgatado por um aluno, para conferir a troca no momento do atendimento.

### 📧 Serviço de Email *(integração)*

- Como sistema de moeda estudantil, quero acionar o serviço de email a cada recebimento de moedas e a cada resgate de vantagem, para que aluno e parceiro sejam informados e possam conferir a transação pelo código gerado.

## ⚙️ Regras de Negócio

- 🔑 Alunos, professores e empresas parceiras possuem login e senha, e toda operação exige autenticação.
- 🏫 As instituições de ensino já estão pré-cadastradas no sistema, para seleção pelo aluno.
- 👩‍🏫 Os professores já estão pré-cadastrados no sistema, a partir da lista enviada pela instituição no momento da parceria, e armazenam nome, CPF e departamento, sempre vinculados a uma instituição.
- 🪙 Cada professor recebe 1.000 moedas por semestre, e esse total é **acumulável**: moedas não distribuídas permanecem no saldo corrente quando o novo crédito é feito.
- 💸 O professor só pode enviar moedas se possuir saldo suficiente para o montante informado.
- ✍️ O motivo do reconhecimento é uma mensagem aberta e de preenchimento **obrigatório** no envio de moedas.
- 📩 O aluno é notificado por email a cada recebimento de moedas.
- 📉 O resgate de uma vantagem debita o custo em moedas do saldo do aluno.
- 🎟️ Todo resgate gera um código pelo sistema, enviado por email tanto ao aluno (cupom) quanto à empresa parceira (conferência).
- 🧾 Toda vantagem cadastrada deve possuir descrição, foto do produto e custo em moedas.
- 📊 O extrato apresenta o saldo atual e as transações do usuário: envios, no caso do professor; recebimentos e trocas, no caso do aluno.

## 🗺️ Diagrama de Caso de Uso

![Diagrama de Caso de Uso](docs/diagrama-casos-de-uso.png)

## 🧩 Diagrama de Classes

![Diagrama de Classes](docs/diagrama-classes.png)

## 🏗️ Diagrama de Componentes

![Diagrama de Componentes](docs/diagrama-componentes.png)

## 🚀 Status do Projeto

- [ ] Lab03S01 — Diagrama de Casos de Uso + Histórias de Usuário + Diagrama de Classes + Diagrama de Componentes
- [ ] Lab03S02 — Modelo ER, estratégia de acesso ao banco de dados e CRUDs de aluno e empresa parceira (versão inicial)
- [ ] Lab03S03 — CRUDs de aluno e empresa parceira (versão final) + apresentação da arquitetura e da camada de persistência

## ✍️ Autores

- Júlia de Souza Ventura
- Yuri Cardoso Viana

---

<p align="center">Desenvolvido para a disciplina de Projeto de Software — PUC Minas 💜</p>
