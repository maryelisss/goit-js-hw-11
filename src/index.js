import PicturesApiService from './fetchPictures.js'
import Notiflix, { Notify } from 'notiflix';


const searchForm = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more")

searchForm.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMore);

const picturesApiService = new PicturesApiService();

function onSearch(e) {
    e.preventDefault();
    picturesApiService.query = e.currentTarget.elements.searchQuery.value;
    picturesApiService.resetPage();
    picturesApiService.fetchPictures()
                .then(searchResult).catch(() => {
            Notify.warning(`Sorry, there are no images matching your search query. Please try again.`);
            gallery.innerHTML = ``;
        });

}

function searchResult(array) {
    if (array.length !== 0 ) {
        renderGalleryCard(array);
    }
    else {
        Notify.info(`Sorry, there are no images matching your search query. Please try again.`);
    }
}

function renderGalleryCard(array) {
        const murkup = array.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item"><b>Likes</b> ${likes}</p>
    <p class="info-item"><b>Views</b> ${views}</p>
    <p class="info-item"><b>Comments</b> ${comments}</p>
    <p class="info-item"><b>Downloads</b> ${downloads}</p>
  </div>
</div>`
            }).join("");
            gallery.innerHTML = murkup;
}

function onLoadMore() {
    picturesApiService.fetchPictures().then(renderGalleryCard);
}