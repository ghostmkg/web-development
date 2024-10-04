//  https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png
// src means source
// container is id
const container = document.querySelector('#container');
const baseURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'
// url declare krdia fr loop m likhdia

for(let i=1 ; i<151 ; i++){
    // new img add krne ka tarikka
    const pokemon = document.createElement('div');
    pokemon.classList.add('pokemon');
    const label = document.createElement('span');
    label.innerText = `#${i}`
    const newImg = document.createElement('img');
    newImg.src = `${baseURL}${i}.png`

    pokemon.appendChild(newImg);
    pokemon.appendChild(label);
    container.appendChild(pokemon)
}
