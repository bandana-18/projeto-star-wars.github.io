let currentPageUrl = "https://swapi.dev/api/people/";

window.onload = async () => {
    try {
        await loadCharacters(currentPageUrl);
    } catch (error) {
        console.log(error);
        alert("Erro ao carregar cards");
    }

    const nextButton = document.getElementById("next-button");
    const backButton = document.getElementById("back-button");

    nextButton.addEventListener("click", loadNextPage);
    backButton.addEventListener("click", loadPreviousPage);
};

async function loadCharacters(url) {
    //url é o nome da chave que está armazenando o link de cada personagem
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = ""; // vai limpar os resultados anteriores para que possa ser carregado os novos resultados na pagina

    try {
        const response = await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach((character) => {
            //results é o nome da chave que esta armazenado as informações dos personagens
            const card = document.createElement("div");
            card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(
                /\D/g,
                ""
            )}.jpg')`; // termo RegExp utilizado para implementar o uso de concatenização da id

            card.className = "cards";

            const characterNameBG = document.createElement("div");
            characterNameBG.className = "character-name-bg";

            const characterName = document.createElement("span");
            characterName.className = "character-name";
            characterName.innerText = `${character.name}`; //name é o name é o nome da chave que armazena o nome dos personagens

            characterNameBG.appendChild(characterName);
            card.appendChild(characterNameBG);

            card.onclick = () => {
                const modal = document.getElementById("modal");
                modal.style.visibility = "visible";

                const modalContent = document.getElementById("modal-content");
                modalContent.innerHTML = "";

                const characterImage = document.createElement("div");
                characterImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(
                    /\D/g,
                    ""
                )}.jpg')`;
                characterImage.className = "character-image";

                const name = document.createElement("span");
                name.className = "character-details";
                name.innerText = `Nome: ${character.name}`;

                const height = document.createElement("span");
                height.className = "character-details";
                height.innerText = `Altura: ${convertHeight(character.height)}`;

                const mass = document.createElement("span");
                mass.className = "character-details";
                mass.innerText = `Peso: ${convertMass(character.mass)}`;

                const birthYear = document.createElement("span");
                birthYear.className = "character-details";
                birthYear.innerText = `Nascimento: ${convertBirthYear(
                    character.birth_year
                )}`;

                const gender = document.createElement("span");
                gender.className = "character-details";
                gender.innerText = `Gênero: ${convertGender(character.gender)}`;

                modalContent.appendChild(characterImage);
                modalContent.appendChild(name);
                modalContent.appendChild(height);
                modalContent.appendChild(mass);
                modalContent.appendChild(birthYear);
                modalContent.appendChild(gender);
            };
            mainContent.appendChild(card);
        });

        const nextButton = document.getElementById("next-button");
        const backButton = document.getElementById("back-button");

        nextButton.disabled = !responseJson.next; //next é o nome da chave que consta com a url do proximo valor que queremos na api
        backButton.disabled = !responseJson.previous; //previous é o nome da chave que consta com a url do valor anterior que temos na api

        backButton.style.visibility = responseJson.previous
            ? "visible"
            : "hidden"; // aqui usamos o ? para analisar nossa visibilidade do botão, se houver previous ela vai ser visivel, caso contrario não sera visivel

        nextButton.style.visibility = responseJson.next ? "visible" : "hidden";

        currentPageUrl = url;
    } catch (error) {
        alert("Erro ao carregar os characters");
        console.log(error);
    }
}

async function loadNextPage() {
    if (!currentPageUrl) return; //se ! o valor for nulo, ele vai dar um return, isso serve para previnir erros

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        await loadCharacters(responseJson.next); //next é o nome da chave que consta com a url da proxima pagina dos personagens da api
    } catch (error) {
        console.log(error);
        alert("Erro ao carregar a próxima página");
    }
}

async function loadPreviousPage() {
    if (!currentPageUrl) return; //se ! o valor for nulo, ele vai dar um return, isso serve para previnir erros

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        await loadCharacters(responseJson.previous); //previous é o nome da chave que consta com a url da pagina anterior dos personagens da api
    } catch (error) {
        console.log(error);
        alert("Erro ao carregar a página anterior");
    }
}

function hideModal() {
    const modal = document.getElementById("modal");
    modal.style.visibility = "hidden";
}

function convertGender(gender) {
    const generos = {
        female: "feminino",
        male: "masculino",
        hermaphrodite: "hermafrodita",
        none: "nenhum",
        "n/a": "indefinido",
    };

    return generos[gender.toLowerCase()] || gender;
} //função criada para traduzir o texto da api para oque eu denifir, no caso estou definindo os generos para portugues
//o toLowerCase é para retornar a string com letras minusculas
// o ||gender indica que, caso não houver nenhuma das palavras indicadas ali, vai retornar oque estiver na api

function convertHeight(height) {
    if (height === "unknown") {
        return "desconhecida";
    }

    return (height / 100).toFixed(2);
} //vai converter a altura para nossa identificação, no caso, é necessario dividir por 100 para ficar na leitura de nosso pais
// o unknown é caso não haja altura para tal character

function convertMass(mass) {
    if (mass === "unknown") {
        return "desconhecido";
    }

    return `${mass} KG`;
} //converter o peso para adicionar um KG no final

function convertBirthYear(birthYear) {
    if (birthYear === "unknown") {
        return "desconhecido";
    }

    return birthYear;
} //converser o nascimento para retornar um desconhecido caso haja um unknown
