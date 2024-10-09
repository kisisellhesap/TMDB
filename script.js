const movieList = document.querySelector(".movie-list");
const searchInput = document.querySelector("#search-input");
const pageSettings = document.querySelector(".page-settings");
let data;
let pageNumber = 500;
let scrollAmount = 50;
const getApi = async (url) => {
  try {
    const res = await fetch(url);
    // console.log(res);
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.log(error);
  }
};
document.addEventListener("DOMContentLoaded", async function () {
  displayBtn();
  clickBtns();

  const pageParam = localStorage.getItem("activePage") || 1;
  const apiUrl = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=${pageParam}`;
  data = await getApi(apiUrl);

  // console.log(pageParam);

  movieList.innerHTML = `<i class="fa-solid fa-spinner" id="spinner"></i>`;
  pageSettings.children[pageParam - 1].classList.add("active-page");

  setTimeout(() => {
    displayData(data);
    colorRate();
  }, 2000);

  console.log("displayData");
});

const displayData = (data) => {
  movieList.innerHTML = "";
  data.forEach((card) => {
    const cardDiv = createCard(
      card.poster_path,
      card.title,
      card.vote_average,
      card.overview
    );
    movieList.insertAdjacentHTML("beforeend", cardDiv);
  });
};

const createCard = (img, name, rate, overview) => {
  const card = `
         <div class="movie-card">
          <div class="card-img">
          <img
            src="https://image.tmdb.org/t/p/w1280/${img}"
            alt="${name}"
          />
          </div>
          <div class="movie-body">
            <p class="movie-name">${name}</p>
            <span class="movie-rate">${rate.toFixed(1)}</span>
          </div>
          <div class="movie-overview">
          <h3>${name} </h3>
          <p>${overview} </p>
          </div>
        </div>
  
  `;

  return card;
};

searchInput.addEventListener("input", async (e) => {
  const value = e.target.value.trim();
  const pageParam = localStorage.getItem("activePage") || 1;
  const apiUrl = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=${pageParam}`;
  const searchApi = `https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=${value}`;

  // console.log(searchApi);
  if (value) {
    data = await getApi(searchApi);
    console.log(data);

    const filteredData = data.filter((item) => {
      return item.title.toLowerCase().includes(value);
    });

    displayData(filteredData);
  } else {
    data = await getApi(apiUrl);
    displayData(data);
  }
  colorRate();
});

const colorRate = () => {
  const spans = document.querySelectorAll(".movie-rate");

  spans.forEach((span) => {
    const spanText = Number(span.textContent);
    // console.log(spanText);
    if (spanText < 5) {
      span.style.color = "var(--warning-color)";
    } else {
      span.style.color = "var(--success-color)";
    }
  });
};

const displayBtn = () => {
  pageSettings.innerHTML = "";
  for (let i = 0; i < pageNumber; i++) {
    const btn = createButton(i + 1);
    pageSettings.insertAdjacentHTML("beforeend", btn);
  }
};

const createButton = (pageNumber) => {
  return `<button data-id="${pageNumber}"> ${pageNumber}</button>`;
};

const clickBtns = () => {
  for (const btn of pageSettings.children) {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      searchInput.value = "";
      const pageNum = btn.dataset.id;
      localStorage.setItem("activePage", pageNum); // Aktif sayfayı sakla

      const pageParam = localStorage.getItem("activePage") || 1;

      const apiUrl = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=${pageParam}`;
      data = await getApi(apiUrl);

      setTimeout(() => {
        displayData(data);
        colorRate();

        for (const sibling of pageSettings.children) {
          sibling.disabled = false;
        }
      }, 2000);

      const scrollToX =
        btn.offsetLeft - pageSettings.offsetWidth / 2 + btn.offsetWidth / 2;

      pageSettings.scrollTo({
        left: scrollToX,
        behavior: "smooth",
      });

      movieList.innerHTML = `<i class="fa-solid fa-spinner" id="spinner"></i>`;

      for (const sibling of pageSettings.children) {
        sibling.classList.remove("active-page");
        sibling.disabled = true;
      }
      btn.classList.add("active-page");
      // console.log(data);
    });
  }
};
