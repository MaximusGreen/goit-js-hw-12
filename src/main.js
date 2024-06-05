import { fetchImages } from './js/pixabay-api.js';
import { renderImages, clearGallery } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
const perPage = 15;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  query = event.target.elements.searchQuery.value.trim();

  if (!query) {
    iziToast.error({ title: 'Error', message: 'Please enter a search query' });
    return;
  }

  page = 1;
  clearGallery();
  loader.classList.add('visible');
  loadMoreBtn.style.display = 'none';

  try {
    const data = await fetchImages(query, page, perPage);
    if (data.hits.length === 0) {
      iziToast.warning({ title: 'No Results', message: 'No images found. Try a different query.' });
      return;
    }
    renderImages(data.hits);
    new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });

    if (data.hits.length === perPage) {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: error.message });
  } finally {
    loader.classList.remove('visible');
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  loader.classList.add('visible');

  try {
    const data = await fetchImages(query, page, perPage);
    renderImages(data.hits);
    new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });

    if (data.hits.length < perPage) {
      loadMoreBtn.style.display = 'none';
      iziToast.info({ title: 'End of Results', message: "We're sorry, but you've reached the end of search results." });
    }

    window.scrollBy({
      top: document.querySelector('.gallery').lastElementChild.getBoundingClientRect().height * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    iziToast.error({ title: 'Error', message: error.message });
  } finally {
    loader.classList.remove('visible');
  }
});
