import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(inputAction, DEBOUNCE_DELAY));

function inputAction(event) {
  let inputValue = event.target.value.trim();

  if (inputValue.length > 0) {
    fetchCountries(inputValue)
      .then(data => createMarkup(data))
      .catch(console.log);
  } else {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }
}

function createMarkup(countries) {
  if (countries.length > 10) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length > 1 && countries.length < 11) {
    countryInfo.innerHTML = '';
    countryList.innerHTML = countries
      .map(country => {
        const { flags, name } = country;

        return `<li class='country-list__item'>
                  <div class="country-list__img-wrapper">
                    <img src="${flags.svg}" alt="Hello" class='country-list__img'>
                  </div>
                  <p class='country-list__desc'>${name.official}</p>
                </li>`;
      })
      .join('');
  } else {
    countryList.innerHTML = '';
    countryInfo.innerHTML = countries
      .map(country => {
        const { flags, name, capital, population, languages } = country;
        const language = Object.values(languages).join(', ');

        return `
                <img src="${flags.svg}" alt="${name.official}" width='200' class='country-info__img'> 
                <h2 class='country-info__name'>${name.official}</h2>
                <p class='country-info__capital'>Capital: ${capital}</p>
                <p class='country-info__population'>Population: ${population}</p>
                <p class='country-info__languages'>Languages: ${language}</p>
                `;
      })
      .join('');
  }
}
