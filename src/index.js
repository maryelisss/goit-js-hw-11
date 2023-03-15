import PicturesApiService from './fetchPictures.js'
import './css/styles.css';
import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let lightbox = new SimpleLightbox('.gallery a', {captionDelay: 250});
const searchForm = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more")

searchForm.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMore);

const picturesApiService = new PicturesApiService();

async function onSearch(e) {
    e.preventDefault();
    gallery.innerHTML = ``;
    picturesApiService.query = e.currentTarget.elements.searchQuery.value.trim();
    picturesApiService.resetPage();
    try {
        const { data: { hits, totalHits } } =
            await picturesApiService.fetchPictures();
        auditResult({ hits, totalHits });
        numberOfResults(totalHits);
    }
    catch {
        Notify.warning(`Error. Please try again.`);
        console.log(error.massage);
    }
}

function auditResult({ hits, totalHits }) {
    if (hits.length === 0 ) {
        loadMoreBtn.classList.add("hidden");
        Notify.info(`Sorry, there are no images matching your search query. Please try again.`);
        return;
    }
    else if (picturesApiService.page === Math.ceil(totalHits / 40)) {

        renderGalleryCard(hits);
        lightbox.refresh();
        Notify.info(`We're sorry, but you've reached the end of search results.`);
        loadMoreBtn.classList.add("hidden");
        return;
    }
    else {
        renderGalleryCard(hits);
        lightbox.refresh();
        return;
    }
}

function numberOfResults(totalHits) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
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
    
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

    window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
    });
}

async function onLoadMore() {
    picturesApiService.incrementPage();
    try {
    const { data: { hits, totalHits } } = await
        picturesApiService.fetchPictures()
        auditResult({ hits, totalHits });
    }
    catch {
        Notify.warning(`Error. Please try again.`);
    }
}

