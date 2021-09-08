// close img modal
const closeImgModal = () => {
  const modal = query(document, '.modal-img .modal');
  modal.classList.toggle('show');
}

// img template
const imgTemplate = ({ id, imgUri, caption }) => {
  let template = `
    <div class="img-container">
      <img 
        sizes="(min-width: 1335px) 416px, (min-width: 992px) calc(calc(100vw - 72px) / 3), (min-width: 768px) calc(calc(100vw - 48px) / 2), 100vw"
        loading="lazy" alt="gallery img" height="auto" 
        srcset="${imgUri} 100w, ${imgUri} 200w, ${imgUri} 300w, ${imgUri} 400w, ${imgUri} 500w, ${imgUri} 700w, ${imgUri} 800w, ${imgUri} 900w, ${imgUri} 1000w, ${imgUri} 1100w, ${imgUri}"
      >
      <div class="img-caption" data-img-id="${id}" onclick="previewImg(event)">
        <p>
          ${caption}
        </p>
      </div>
    </div>
  `;

  return template;
}

// fetch images from either a DB/JSON file
const fetchImgs = async (imgsUri) => {
  try {
    let uri = await fetch(imgsUri);
    let res;
    res = await uri.json();
    return res;
  } catch (error) {
    console.warn(error)
  }
}

// filter images into seperate arrays in accordance to pre-defined grid columns in the DOM
const filterImgsIntoCols = async () => {
  let count = 0;
  let arr1 = [], arr2 = [], arr3 = [];
  let imgUri = '/public/js/galleryImages.json';

  try {
    let resImgs =  await fetchImgs(imgUri);
    // help put news into required arrarys(for the DOM grid sake, showing the imgs)
    for (let i = 0; i < resImgs.length; i++) {
      // when 'count' shouldn't be more than counts of total pre-defined grid elements
      if (count > 2) {
        count = 0;
      }
      if (count === 0) {
        arr1.push(resImgs[i]);
      }
  
      if (count === 1) {
        arr2.push(resImgs[i]);
      }
  
      if (count === 2) {
        arr3.push(resImgs[i]);
      }
      // increment count
      count++;
    }
    // console.log(arr1, arr2, arr3);
    return  { col1: arr1, col2: arr2, col3: arr3 };
  } catch (error) {
    console.warn(error)
  }
}

// help show all imgs in the DOM
const showGalleryImgs = async () => {
  // pre-defined img template grid columns
  const imgColOne = query(document, '[data-img-col-one]');
  const imgColTwo = query(document, '[data-img-col-two]');
  const imgColThree = query(document, '[data-img-col-three]');

  // populate images into required DOM elements
  const { col1, col2, col3 } = await filterImgsIntoCols();
  /* empty all the grid first of the skeleton loading */
  imgColOne.innerHTML = '';
  imgColTwo.innerHTML = '';
  imgColThree.innerHTML = '';

  /* first column grid */
  col1.forEach(img => {
    imgColOne.innerHTML += imgTemplate(img);
  });
  /* second column grid */
  col2.forEach(img => {
    imgColTwo.innerHTML += imgTemplate(img);
  });
  /* third column grid */
  col3.forEach(img => {
    imgColThree.innerHTML += imgTemplate(img);
  });
}

// preview img
const previewImg = (event) => {
  const imgContainer = event.target.parentElement;
  // img clicked on
  const theImg = query(imgContainer, 'img').currentSrc;
  const imgId = event.target.dataset.imgId;
  const imgModal = query(document, '[data-img-modal]');
  // the modal img element
  let modalImg = query(imgModal, 'img')
  modalImg.src = theImg;
  modalImg.srcset = `${theImg} 100w, ${theImg} 200w, ${theImg} 300w, ${theImg} 400w, ${theImg} 500w, ${theImg}`
  modalImg.dataset.imgId = imgId;

  // show the image modal window
  imgModal.classList.toggle('show');
}

// display all images in the DOM
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    showGalleryImgs()
  }, 3000)
});