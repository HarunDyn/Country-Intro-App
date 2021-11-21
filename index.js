const ulDropdown = document.querySelector(".dropdown-menu");
const clear = document.getElementById("clear");
const countryElm = document.querySelector('.countries');

console.log(ulDropdown)
// Event

ulDropdown.addEventListener("click", displayCountry);
clear.addEventListener("click", clearHtml);


// Function

function clearHtml() {
  countryElm.innerHTML = "";
}

function displayCountry(e) {

  let countryName = e.target.innerText;
  console.log(countryName)
  showCountryWithNeighbours(countryName);
}

async function get() {
  let response = await fetch("https://restcountries.com/v3.1/all");
  let countryName = await response.json()

  countryName
    .map(array => array.name.common)
    .forEach(country => {
      ulDropdown.innerHTML += `<li><a class="dropdown-item" href="#">${country}</a></li>`
    });

}

get();


const renderCountry = (data, className = '') => {
  const {
    name: {
      common: countryName
    },
    region,
    capital,
    flags: {
      svg: countryFlag
    },
    population,
    languages,
    currencies,
  } = data; // countryName
  const htmlContent = `
  <div class="country ${className}">
    <img class="country__img" src="${countryFlag}" />
    <div class="country__data">
      <h3 class="country__name">${countryName}</h3>
      <h4 class="country__region">${region}</h4>
      <p class="country__row">
              <span><i class="fas fa-2x fa-landmark"></i></span>${capital}</p>
      <p class="country__row"> <span><i class="fas fa-lg fa-users"></i></span>${(
        +population / 1_000_000
      ).toFixed(1)}M People</p>
      <p class="country__row"><span><i class="fas fa-lg fa-comments"></i></span>${Object.values(
        languages
      )}</p>
      <p class="country__row"><span><i class="fas fa-lg fa-money-bill-wave"></i></span>${
        Object.values(currencies)[0].name
      } <strong>${Object.values(currencies)[0].symbol}</strong>
      </p>
    </div>
  </div>
  `;
  countryElm.insertAdjacentHTML('beforeend', htmlContent);
  countryElm.style.opacity = 1;
};



const getCountryDataByName = async countryName => {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    if (!response.ok) throw new Error(`something is wrong! ${response.status}`);
    const data = await response.json();
    console.log(data[0])
    return data[0];
  } catch (error) {
    renderError(error.message);
    console.log(error.message);
  } finally {
    // always executed
    // console.log('try catch block finished either successfully or with failures');
  }
};



const getCountryDataByCode = async countryCode => {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
    if (!response.ok) throw new Error(`something is wrong! ${response.status}`);
    const data = await response.json();
    return data[0];
    // return countryData;
  } catch (error) {
    renderError(error.message);
    console.log(error.message);
  }
};

const showCountryWithNeighbours = async countryName => {
  try {
    const countryData = await getCountryDataByName(countryName);
    renderCountry(countryData);
    const neighbours = countryData.borders;
    if (!neighbours) throw new Error('No neighbours 🤷‍♀️');
    neighbours.forEach(async neighbour => {
      console.log(neighbour)
      const country = await getCountryDataByCode(neighbour);
      renderCountry(country, 'neighbour');
    });

  } catch (error) {
    renderError(error.message);
  }
};

const renderError = msg => {
  const countryElm = document.querySelector('.countries');
  countryElm.insertAdjacentText('beforeend', msg);
  countryElm.style.opacity = 1;
};