import express from 'express';

const host = '0.0.0.0';
const porta = 3000;

const app = express();

app.use(express.urlencoded({extended:true}));

let listaFornecedores = [];
let usuarioLogado = false;

// ---------------- CSS ----------------

function estilo(){
return `
<style>

body{
font-family:Arial;
background:#f4f4f4;
margin:0;
}

nav{
background:#333;
padding:15px;
}

nav a{
color:white;
margin-right:15px;
text-decoration:none;
}

.container{
width:800px;
margin:auto;
background:white;
padding:20px;
margin-top:30px;
border-radius:5px;
}

input{
width:100%;
padding:8px;
margin-bottom:5px;
}

button{
background:#2e86de;
color:white;
border:none;
padding:10px 20px;
cursor:pointer;
}

button:hover{
background:#1b4f72;
}

.erro{
color:red;
font-size:13px;
margin-bottom:10px;
}

table{
width:100%;
border-collapse:collapse;
}

th{
background:#2e86de;
color:white;
padding:10px;
}

td{
border:1px solid #ccc;
padding:8px;
text-align:center;
}

tr:nth-child(even){
background:#f2f2f2;
}

</style>
`
}

// ---------------- MENU ----------------

function menu(){
return `
<nav>
<a href="/">Home</a>
<a href="/fornecedor">Cadastrar Fornecedor</a>
<a href="/listaFornecedores">Lista Fornecedores</a>
<a href="/login">Login</a>
<a href="/logout">Logout</a>
</nav>
`
}

// ---------------- FORMULÁRIO ----------------

function formFornecedor(dados={}, erros={}){

return `
<html>
<head>
<meta charset="UTF-8">
${estilo()}
</head>

<body>

${menu()}

<div class="container">

<h2>Cadastro de Fornecedor</h2>

<form method="POST" action="/fornecedor">

<label>CNPJ</label>
<input name="cnpj" value="${dados.cnpj || ""}">
<div class="erro">${erros.cnpj || ""}</div>

<label>Razão Social</label>
<input name="razao" value="${dados.razao || ""}">
<div class="erro">${erros.razao || ""}</div>

<label>Nome Fantasia</label>
<input name="fantasia" value="${dados.fantasia || ""}">
<div class="erro">${erros.fantasia || ""}</div>

<label>Endereço</label>
<input name="endereco" value="${dados.endereco || ""}">
<div class="erro">${erros.endereco || ""}</div>

<label>Cidade</label>
<input name="cidade" value="${dados.cidade || ""}">
<div class="erro">${erros.cidade || ""}</div>

<label>UF</label>
<input name="uf" value="${dados.uf || ""}">
<div class="erro">${erros.uf || ""}</div>

<label>CEP</label>
<input name="cep" value="${dados.cep || ""}">
<div class="erro">${erros.cep || ""}</div>

<label>Email</label>
<input name="email" value="${dados.email || ""}">
<div class="erro">${erros.email || ""}</div>

<label>Telefone</label>
<input name="telefone" value="${dados.telefone || ""}">
<div class="erro">${erros.telefone || ""}</div>

<button type="submit">Cadastrar</button>

</form>

</div>

</body>
</html>
`
}

// ---------------- HOME ----------------

app.get("/",(req,res)=>{

res.send(`
<html>
<head>
<meta charset="UTF-8">
${estilo()}
</head>

<body>

${menu()}

<div class="container">

<h1>Sistema de Cadastro</h1>

<p>Bem-vindo ao sistema de fornecedores.</p>

</div>

</body>
</html>
`)

})

// ---------------- FORM ----------------

app.get("/fornecedor",(req,res)=>{

res.send(formFornecedor())

})

// ---------------- CADASTRO ----------------

app.post("/fornecedor",(req,res)=>{

const dados = req.body;

let erros={};

if(!dados.cnpj) erros.cnpj="Informe o CNPJ";
if(!dados.razao) erros.razao="Informe a razão social";
if(!dados.fantasia) erros.fantasia="Informe o nome fantasia";
if(!dados.endereco) erros.endereco="Informe o endereço";
if(!dados.cidade) erros.cidade="Informe a cidade";
if(!dados.uf) erros.uf="Informe a UF";
if(!dados.cep) erros.cep="Informe o CEP";
if(!dados.email) erros.email="Informe o email";
if(!dados.telefone) erros.telefone="Informe o telefone";

// verificar duplicado

let fornecedorExistente = listaFornecedores.find(f => f.cnpj === dados.cnpj);

if(fornecedorExistente){
erros.cnpj="Este CNPJ já está cadastrado";
}

if(Object.keys(erros).length > 0){

return res.send(formFornecedor(dados,erros));

}

listaFornecedores.push(dados);

res.redirect("/listaFornecedores");

})

// ---------------- LISTA ----------------

app.get("/listaFornecedores",(req,res)=>{

res.write(`
<html>
<head>
<meta charset="UTF-8">
${estilo()}
</head>

<body>

${menu()}

<div class="container">

<h2>Lista de Fornecedores</h2>

<table>

<tr>
<th>ID</th>
<th>CNPJ</th>
<th>Razão</th>
<th>Fantasia</th>
<th>Cidade</th>
<th>UF</th>
</tr>
`)

for(let i=0;i<listaFornecedores.length;i++){

let f = listaFornecedores[i];

res.write(`
<tr>
<td>${i+1}</td>
<td>${f.cnpj}</td>
<td>${f.razao}</td>
<td>${f.fantasia}</td>
<td>${f.cidade}</td>
<td>${f.uf}</td>
</tr>
`)

}

res.write(`

</table>

<br>

<a href="/fornecedor">Cadastrar novo fornecedor</a>

</div>

</body>
</html>
`)

res.end()

})

// ---------------- LOGIN ----------------

app.get("/login",(req,res)=>{

res.send(`
<html>
<head>
<meta charset="UTF-8">
${estilo()}
</head>

<body>

${menu()}

<div class="container">

<h2>Login</h2>

<form method="POST" action="/login">

<label>Usuário</label>
<input name="usuario">

<label>Senha</label>
<input type="password" name="senha">

<button type="submit">Entrar</button>

</form>

</div>

</body>
</html>
`)

})

// ---------------- VALIDAR LOGIN ----------------

app.post("/login",(req,res)=>{

const {usuario,senha} = req.body;

if(usuario === "admin" && senha === "123"){

usuarioLogado = true;

res.send(`
<html>
<head>
<meta charset="UTF-8">
${estilo()}
</head>

<body>

${menu()}

<div class="container">

<h2>Login realizado com sucesso!</h2>

</div>

</body>
</html>
`)

}else{

res.send(`
<html>
<head>
<meta charset="UTF-8">
${estilo()}
</head>

<body>

${menu()}

<div class="container">

<h2 class="erro">Usuário ou senha incorretos</h2>

<a href="/login">Tentar novamente</a>

</div>

</body>
</html>
`)

}

})

// ---------------- LOGOUT ----------------

app.get("/logout",(req,res)=>{

usuarioLogado=false;

res.send(`
<html>
<head>
<meta charset="UTF-8">
${estilo()}
</head>

<body>

${menu()}

<div class="container">

<h2>Logout efetuado com sucesso!</h2>

</div>

</body>
</html>
`)

})

app.listen(porta,host,()=>{

console.log(`Servidor rodando em http://${host}:${porta}`)

})