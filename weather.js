const form = document.querySelector('.top-banner form');
const input = document.querySelector('.top-banner input');
const msg = document.querySelector('.top-banner .msg');
const list = document.querySelector('.ajax-section .cities');
const close = document.querySelector('.ajax-section');
console.log(close);

localStorage.setItem(
  'apikey',
  EncryptStringAES('4eb469876df94c279cf81f5f1789653f')
);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  getWeatherDataFromApi();
});

const getWeatherDataFromApi = async () => {
  let apikey = DecryptStringAES(localStorage.getItem('apikey'));
  let inputVal = input.value;
  let weatherType = 'metric';
  // console.log(apikey);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apikey}&units=${weatherType}`;

  try {
    const response = await axios.get(url);
    // const response = await axios(url);

    console.log(response.data);
    const { main, name, sys, weather } = response.data;

    const cityListItems = list.querySelectorAll('.city');
    const cityListItemArray = Array.from(cityListItems);
    console.log(cityListItemArray);
    if (cityListItemArray.length > 0) {
      const filteredArray = cityListItemArray.filter(
        (card) => card.querySelector('.city-name span').innerText == name
      );
      if (filteredArray.length > 0) {
        msg.innerText = `You already know the weather for ${
          filteredArray[0].querySelector('.city-name span').innerText
        }, Please search for another city 😉`;
        form.reset();
        input.focus();
        return;
      }
    }

    const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;
    console.log(iconUrl);

    const createdCityCardLi = document.createElement('li');
    createdCityCardLi.classList.add('city');
    const createdCityCardLiInnerH = `
    <button type="button" id="btn"><i class="far fa-times-circle"></i></button>
    <h2 class="city-name" data-name="${name}, ${sys.country}">
        <span>${name}</span>
        <sup>${sys.country}</sup>
    </h2>
    <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
    <figure>
        <img class="city-icon" src="${iconUrl}">
        <figcaption>${weather[0].description}</figcaption>
    </figure>
    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#${name}">
  More
  </button>
  <div class="modal fade" id="${name}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
         <h5 class="modal-title" id="staticBackdropLabel">${name}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <span>Felt Temperature: ${Math.round(main.feels_like)}</span> <br>
        <span>Maximum Temperature: ${Math.round(main.temp_max)}</span>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>`;

    createdCityCardLi.innerHTML = createdCityCardLiInnerH;
    list.appendChild(createdCityCardLi);

    msg.innerText = '';
    // form.reset() ==> input.value = "";
    form.reset();
    input.focus();
  } catch (error) {
    msg.innerText = error;
  }

  close.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-times-circle')) {
      e.target.parentElement.parentElement.remove();
    }
  });
};
