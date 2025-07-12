const apiKeyInput = document.getElementById('apiKey');
const selectGame = document.getElementById('gameSelect');
const question = document.getElementById('questionInput');
const askButton = document.getElementById('button');
const form = document.getElementById('form');
const aiResponse = document.getElementById('aiResponse');


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
        const text = await askIa(questionv, game, apiKey) // criar função para pedir para a IA
        aiResponse.querySelector('.responseContent').innerHTML
        aiResponse.classList.remove('hidden');
    } catch (error) {
        console.log('error', error);
    } finally {
        askButton.disabled = false;
        askButton.textContent = 'Perguntar';
        askButton.classList.remove('loading');
    }
}

form.addEventListener('submit', sendForm);
