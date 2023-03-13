export default class PicturesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  fetchPictures() {
  const BASE_URL = 'https://pixabay.com/api'
  const KEY = '?key=34365421-a5fa261bff150f70fc1f2b1da'
  
    return fetch(`${BASE_URL}/${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`).then(response => {
      if (!response.ok) {
      throw new Error(response.status);
    } return response.json()
    }).then(data => {
      this.incrementPage();
      return data.hits
    });
  };   
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}