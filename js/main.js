const mainContent = document.querySelector(".main_content");
const mainPagination = document.querySelector(".main_pagination");

let pagesAll = 0;
const getResponse = async (page, param) => {
  console.log(param);
  const responseCharacter = await fetch(
    `https://rickandmortyapi.com/api/character?${param}`
  );
  const character = await responseCharacter.json();
  pagesAll = Math.ceil(character.info.count / 20);
  renderCards(character.results);
  renderPagination(page, 3, pagesAll);
};
const getEpisode = async (apiEpisode) => {
  const responseEpisode = await fetch(apiEpisode);
  const episode = await responseEpisode.json();
  return episode.name;
};

const renderCards = async (character) => {
  let cards = "";
  await character.reduce(async (_, card) => {
    const episode = await getEpisode(card.episode[0]);
    console.log(episode);
    cards += `
        <div class="main_card">
                    <div class="card_left">
                        <img class="card_left-img" src="${card.image}" alt="">
                    </div>
                    <div class="card_right">
                        <div class="card_name">${card.name}</div>
                            <div class="card_status-species";>
                            ${
                              card.status === "Alive"
                                ? `<span class="card_status" style="background-color: green;"></span>`
                                : ""
                            }
                            ${
                              card.status === "Dead"
                                ? `<span class="card_status" style="background-color: red;"></span>`
                                : ""
                            }
                            ${
                              card.status === "unknown"
                                ? `<span class="card_status" style="background-color: rgb(158, 158, 158);"></span>`
                                : ""
                            }    
                            ${
                              card.status.charAt(0).toUpperCase() +
                              card.status.slice(1)
                            }-${
      card.species.charAt(0).toUpperCase() + card.species.slice(1)
    }
                            </div>
                        
                        <div class="card_last-location">
                            <div class="last-location-placeholder">Последнее известное местоположение:</div>
                            <a href="${
                              card.location.url
                            }" class="last-location-info">${
      card.location.name === "unknown"
        ? `${
            card.location.name.charAt(0).toUpperCase() +
            card.location.name.slice(1)
          }`
        : `${card.location.name}`
    }</a>
                        </div>
                        <div class="card_first-seen">
                            <div class="first-seen-placeholder">Впервые замечен в:</div>
                            <a href="" class="first-seen-info">${episode}</a>
                        </div>
                    </div>
                </div>
        `;
  });

  mainContent.innerHTML = cards;
};

const renderPagination = (page, amount, pagesAll) => {
  mainPagination.innerHTML = "";
  mainPagination.innerHTML += `<button class="pagination_first">В начало (${1})</button>`;
  mainPagination.innerHTML += `<div class="pagination_menu"></div>`;
  const pagination = document.querySelector(".pagination_menu");
  let nums = "";
  const maxPage = page + amount;
  const minPage = page - amount;

  for (let i = minPage; i <= maxPage; i++) {
    if (i >= 1 && i <= pagesAll) {
      // Проверка, чтобы числа оставались в диапазоне от 1 до 42
      nums += `
        <button class="pagination_num ${
          page == i ? "num_select" : ""
        }">${i}</button>
        `;
    }
  }
  pagination.innerHTML = nums;
  mainPagination.innerHTML += `<button class="pagination_last">В конец (${pagesAll})</button>`;
};
let params = "";
const getParams = (status, species, page) => {
  console.log(status, species, page);
  params = new URLSearchParams({
    page,
    species,
    status,
  });
//   console.log(params.toString());
  return params.toString();
};

document.addEventListener("DOMContentLoaded", () => {
  getResponse(1);
});

const clickHandler = (event) => {
    const startBtn = event.target.closest(".main_start");
    const paginationBtn = event.target.closest(".pagination_num");
    const startParination = event.target.closest(".pagination_first");
    const endParination = event.target.closest(".pagination_last");
  
    const filterBtn = event.target.closest(".filter_accept");
  
    if (startBtn) {
      getResponse(1);
    }
    if (paginationBtn) {
      const speciesFilter = document.querySelector(".filter_species");
      const statusFilter = document.querySelector(".filter_status");
      params = getParams(
        statusFilter.value,
        speciesFilter.value,
        +paginationBtn.innerHTML
      );
      getResponse(+paginationBtn.innerHTML, params);
    }
    if (startParination) {
      getResponse(1);
    }
    if (endParination) {
      getResponse(pagesAll);
    }
    if (filterBtn) {
      const speciesFilter = document.querySelector(".filter_species");
      const statusFilter = document.querySelector(".filter_status");
      const params = getParams(statusFilter.value, speciesFilter.value);
      console.log(params);
      getResponse(1, params);
    }
  }
  

document.addEventListener("click", clickHandler);
