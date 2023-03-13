import API from './fetchPictures.js'
// import Notiflix, { Notify } from 'notiflix';


const searchForm = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
searchForm.addEventListener("submit", onSearch);

function onSearch(e) {
    e.preventDefault();
    const searchWord = e.target.value.trim();
    if (searchWord !== '') {
        API.fetchPictures(searchWord).then(searchResult).catch(() => {
            Notify.warning(`Oops, there is no country with that name`);
            gallery.innerHTML = ``;
        });
    }
    else {gallery.innerHTML = ``;
    }
}

function searchResult(array) {}
