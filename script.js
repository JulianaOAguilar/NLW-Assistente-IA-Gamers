const apiKeyInput = document.getElementById('apiKey');
const selectGame = document.getElementById('gameSelect');
const question = document.getElementById('questionInput');
const askButton = document.getElementById('button');
const form = document.getElementById('form');
const aiResponse = document.getElementById('aiResponse');

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

const askIa = async (questionv, game, apiKey) => {
    const model = 'gemini-2.5-flash';
    const baseURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const pergunta = `
Você é um assistente especialista em meta para o jogo ${game}.

Sua missão é responder perguntas do usuário com base no seu conhecimento do jogo, incluindo:
- Estratégias
- Builds
- Dicas atualizadas

Regras importantes:
- Se você não souber a resposta com certeza, diga: "Não sei"
- Nunca invente informações ou itens inexistentes
- Se a pergunta não for sobre o jogo, responda:
  "Essa pergunta não está relacionada ao jogo. Considere a data atual (${new Date().toLocaleDateString()}) e pesquise sobre o patch atual antes de responder."
- **Nunca mencione conteúdos que você não tem certeza se existem no patch atual

Limite:
- Economize nas palavras
- Seja direto e objetivo
- Responda com no máximo 500 caracteres
- Não use saudações ou despedidas. Responda apenas o que foi perguntado

🔎 Pergunta do usuário:
"${questionv}"
`

    const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }]
    // chamada API
    const resposta = await fetch(baseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            tools
        })
    })

    const data = await resposta.json()
    console.log({ data })
    return data.candidates[0].content.parts[0].text
}


const sendForm = async (event) => {
    event.preventDefault();
    const apiKey = apiKeyInput.value;
    const game = selectGame.value;
    const questionv = question.value;

    if (apiKey == '' || game == '' || questionv == '') {
        alert("Preencha todos os campos!");
        return;
    }

    askButton.disabled = true;
    askButton.textContent = 'Perguntando...';
    askButton.classList.add('loading');

    try {
        // perguntar para a IA
        const text = await askIa(questionv, game, apiKey)
        aiResponse.querySelector('.responseContent').innerHTML = markdownToHTML(text)
        aiResponse.classList.remove('hidden');


    } catch (error) {
        console.log('error', error);
    } finally {
        askButton.disabled = false;
        askButton.textContent = 'Perguntar';
        askButton.classList.remove('loading');
    }
}
form.addEventListener('submit', sendForm)