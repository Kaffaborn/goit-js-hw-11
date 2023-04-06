import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from "axios";
import "./styles.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api/' ;
const API_KEY = '35073807-6e0c78c0f1d8a4d5139e72432';
let searchQuery = '';
let currentPage = 1;

const lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const refs = {
    searchForm: document.querySelector('#search-form'),
    galleryCard: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  resetPage();
  e.preventDefault();
  clearGalleryContainer();
  searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  const url = `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`;

  if (searchQuery === '') {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notify.failure("Please enter something.");
  } else {
    fetchImages(url).then(hits => {
      if (hits.total === 0) {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        } else {
          Notify.success(`Hooray! We found ${hits.totalHits} images.`);
        }
    })
  }  
};

function clearGalleryContainer() {
    refs.galleryCard.innerHTML = '';
  };

function onLoadMore() {
  const url = `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`;
  fetchImages(url);
};

async function fetchImages(url){
  try {
    const response = await axios(url);
    const hits = await response.data;
    refs.galleryCard.insertAdjacentHTML('beforeend', renderCards(hits));
    currentPage += 1;
    refs.loadMoreBtn.classList.remove('is-hidden');
    lightBox.refresh();
    return hits;
  } catch {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notify.failure("We're sorry, but you've reached the end of search results.");
  }
}

function renderCards(hits) {
  return hits.hits.map(({webformatURL, largeImageURL, tags, likes, views, comments,  downloads}) => {
    return `
    
    <a class="gallery__link" href='${largeImageURL}'>
    <div class="gallery__card">
    <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info__item">
        <b>Likes: ${likes}</b>
      </p>
      <p class="info__item">
        <b>Views: ${views}</b>
      </p>
      <p class="info__item">
        <b>Comments: ${comments}</b>
      </p>
      <p class="info__item">
        <b>Downloads: ${downloads}</b>
      </p>
    </div>
    </div>
    </a>`
  }).join('');
};



function resetPage(){
  currentPage = 1;
}