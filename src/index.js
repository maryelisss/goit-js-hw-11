import PicturesApiService from './fetchPictures.js'
import './css/styles.css';
import Notiflix, { Notify } from 'notiflix';
// import SimpleLightbox from "simplelightbox";
import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm";

const searchForm = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more")

searchForm.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMore);

const picturesApiService = new PicturesApiService();

function onSearch(e) {
    e.preventDefault();
    gallery.innerHTML = ``;
    picturesApiService.query = e.currentTarget.elements.searchQuery.value;
    picturesApiService.resetPage();
    picturesApiService.fetchPictures()
                .then(auditResult).catch(() => {
            Notify.warning(`Error. Please try again.`);
        });

}

function auditResult({ hits, totalHits }) {
    if (hits.length !== 0 ) {
        renderGalleryCard(hits);
            let lightbox = new SimpleLightbox('.gallery a', {captionDelay: 250});
            // lightbox.refresh();
    }
    else if (picturesApiService.page === Math.ceil(totalHits / 40)) {
        Notify.info(`We're sorry, but you've reached the end of search results.`);
        loadMoreBtn.classList.add("hidden");
    }
    else {
        loadMoreBtn.classList.add("hidden");
        Notify.info(`Sorry, there are no images matching your search query. Please try again.`);
    }
}

function renderGalleryCard(array) {
        const murkup = array.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `<a href="${webformatURL}"><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="image" />
  <div class="info">
    <p class="info-item"><b>Likes</b> ${likes}</p>
    <p class="info-item"><b>Views</b> ${views}</p>
    <p class="info-item"><b>Comments</b> ${comments}</p>
    <p class="info-item"><b>Downloads</b> ${downloads}</p>
  </div>
</div></a>`
            }).join("");
    gallery.insertAdjacentHTML("beforeend", murkup);
    loadMoreBtn.classList.remove("hidden");
}

function onLoadMore() {
    picturesApiService.fetchPictures().then(auditResult);
}


