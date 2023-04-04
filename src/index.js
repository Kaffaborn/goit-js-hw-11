import Notiflix from 'notiflix';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/' ;
const API_KEY = '35073807-6e0c78c0f1d8a4d5139e72432';
let searchQuerry = '';
let currentPage = 1;

const refs = {
    searchForm: document.querySelector('#search-form'),
    galleryCard: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}

refs.searchForm.addEventListener('submit', onSearch);



function onSearch(e) {
    resetPage();
    e.preventDefault();
    clearContainer();
    
    searchQuerry = e.currentTarget.elements.searchQuery.value.trim();
    
    const url = `${BASE_URL}?key=${API_KEY}&q=${searchQuerry}&type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`;
        if (searchQuerry === '') {
            // refs.loadMoreBtn.classList.add('is-hidden');
            Notiflix.Notify.failure("Enter something.");
            }
        else{
            fetchImg(url).then(cards => {
            if (cards.total === 0) {
            // refs.loadMoreBtn.classList.add('is-hidden');
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            }
        else{
            Notiflix.Notify.success(`Hooray! We found ${cards.totalHits} images.`);
            }
        })
}
}

async function fetchImg(url){
  try {
    const response = await axios(name);
    const cards = response.data;
    refs.galleryCard.insertAdjacentHTML('beforeend', renderCards(cards));
    currentPage +=1;
    // refs.loadMoreBtn.classList.remove('is-hidden');
    // lightbox.refresh();
    return cards;
  } catch{
    // refs.loadMoreBtn.classList.add('is-hidden');
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
  }
}

function renderCards(cards){
    return cards.hits.map(({webformatURL,largeImageURL,tags,likes,views,comments, downloads}) => {
return `<div class="photo-card">
<a class='gallery__link' href='${largeImageURL}'><img class='gallery__image' src="${webformatURL}" alt="${tags}" loading="lazy" width='360' height='260'/></a>
<div class="info">
  <p class="info-item">
    <b>Likes:${likes}</b>
  </p>
  <p class="info-item">
    <b>Views:${views}</b>
  </p>
  <p class="info-item">
    <b>Comments:${comments}</b>
  </p>
  <p class="info-item">
    <b>Downloads:${downloads}</b>
  </p>
</div>
</div>`
    }).join('')
}

function clearContainer(){
  refs.galleryCard.innerHTML ='';
}

function resetPage(){
  currentPage = 1;
}