// get element by it's id
const id = (ele) =>  {
  return document.getElementById(ele);
}

// get element with a css query selector
const query = (ele, cssQuery) => {
  return ele.querySelector(cssQuery);
}

// get every element with same css class selector
const queryAll = (ele, cssQuery) => {
  return ele.querySelectorAll(cssQuery);
}

// for small navigation menu
const smallNav = () => {
  // the hambuger icon btn & hidden nav menu
  let menuBtn = query(document, '.small-menu-icon');
  let navbarMenu = query(document, '.navbar-menus');

  // add click event to hambuger-icon btn: shows menu & changes icon
  menuBtn.addEventListener('click', () => {
    if(menuBtn.classList.contains('ti-menu')) {
      menuBtn.classList.remove('ti-menu');
      menuBtn.classList.add('ti-close');
    } else {
      menuBtn.classList.add('ti-menu');
      menuBtn.classList.remove('ti-close');
    }

    // toggle btw showing & hiding navbar menus
    navbarMenu.classList.toggle('show-flex');
  });
}

// ======*** Home Page Image rotate ***======
let heroImgRotateProps = {
  indxCouter: 0,
  frontImgs: queryAll(document, "[data-front-imgs]"),
  backImgs: queryAll(document, "[data-back-imgs]"),
  frontImgCount: queryAll(document, "[data-front-imgs]").length,
  backImgCount: queryAll(document, "[data-back-imgs]").length,
  frontContainerImg: query(document, ".flip-img-front img"),
  backContainerImg: query(document, ".flip-img-back img"),
  baseImgURI: '/public/img/'
};

const heroImgRotate = () => {
  // get all necessary images
  const { frontImgs, backImgs } = heroImgRotateProps;

  // total counts of front and back imgs each
  const { frontImgCount, backImgCount } = heroImgRotateProps;
  
  // get font & back face of hero-img containers
  const { frontContainerImg, backContainerImg } = heroImgRotateProps;

  // the container of the images
  const containerImgs = query(document, ".flip-img-inner");

  // specify root/base img URI
  const { baseImgURI } = heroImgRotateProps;

  // image according to counter
  let frontImgCounter = heroImgRotateProps.indxCouter > (frontImgCount - 1) ? 0 : heroImgRotateProps.indxCouter;
  let backImgCounter = heroImgRotateProps.indxCouter > (backImgCount - 1) ? 0: heroImgRotateProps.indxCouter;

  // change container img wanting to rotate to before rotation
  if (containerImgs.classList.contains('rotateY-180')) {
    // for front-face img
    frontContainerImg.src = `${baseImgURI}${frontImgs[frontImgCounter].dataset.frontImgs}`;
    containerImgs.classList.remove('rotateY-180');
  } else {
    // for back-face img
    backContainerImg.src = `${baseImgURI}${backImgs[backImgCounter].dataset.backImgs}`;
    containerImgs.classList.add('rotateY-180');
  }

  // incrementing index counter
  heroImgRotateProps.indxCouter++;
  if (heroImgRotateProps.indxCouter > (frontImgCount - 1)) {
    heroImgRotateProps.indxCouter = 0;
  }

  // console.log(`indexCounter: ${heroImgRotateProps.indxCouter}, frontImgCounter: ${frontImgCounter}, backImgCounter: ${backImgCounter}`);

  // set time interval to execute above given instructions
  // PS: this rotate after 5sec. 
  setTimeout(heroImgRotate, 5000);
};
// ======*** Home Page Image rotate ends ***======

// help truncate text
const truncateText = (str, limit, endChar) => {
  limit = (limit)? limit : 100;
  endChar = (endChar)? endChar : '...';
  // get strings by 'words'
  str = str.split(' ');
  
  // only words(strings) are more than permited 'limit'
  if (str.length > limit) {
    let cutTolimit = str.slice(0, limit);
    return `${cutTolimit.join(' ')}${endChar}`;
  }

  return str.join(' ');
}

// trucate events and news texts on display before preview
const shortNewsAndEventTxt = () => {
  // get all element with the specified css class
  const newsEvents = queryAll(document, '.event-description');

  // truncate all the news & events text.
  newsEvents.forEach(news => {
    news.innerText = truncateText(news.innerText, 14);
  });

  return;
};

// instersection observer for desired element (display element into view only when scroll to)
const lazyLoading = (targetElement) => {
  // create an intesection observer for the target
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // isIntersecting = if user scroll element in view
      if (entry.isIntersecting) {
        let ele = entry.target;
        console.log(ele.classList, ele.tagName);
        // ele.classList.add("scale-io");
        // console.warn('observer is intersecting!..');
        // remove the observer because the img is loaded now
        observer.disconnect();
      }
    });

    // add the observer to targetElement
    io.observe(targetElement);
  });
};


// ======*** Modal Window for previewing news and events ***======
// close "news & events" modal window
const closeNewsModal = () => {
  // get the modal parent window element & modal content element
  const modal = id('previewEventsNews');
  const modalContent = query(document,'.modal-content');

  // animate modal content out of view & close modal window after modal is out of view
  // (PS: take into consideration the animation transition time)
  modalContent.classList.add('modal-hide-sm');
  // execute after 0.4s(current animation transition time frame but can be change in main CSS script) 
  setTimeout(() => {
    modal.style.display = 'none';
    modalContent.classList.remove('modal-hide-sm')
  }, 400);
};

// open "news & events" modal window
const openNewsModal = () => {
  const modal = id('previewEventsNews');
  modal.style.display = "inherit";
};


// ======*** Newsletter subscription  ***======
const newsletter = () => {
  const subscriber = id('subscriberEmail');
  const subscriberAgree = id('subscriberAgreement');
  const errorMsg = query(document, '.error-msg');
  const succcessMsg = query(document, '.subscriber-confirmation-msg');
  
  // check if subscriber's email & agreement are both filled
  if (subscriber.value === "" || subscriberAgree.checked === false) {
    errorMsg.innerHTML = `<span>Please fill in your <b>Email Address correctly!</b>, and make sure you <b>agree</b> to the subscription</span> <i class="ti ti-close" onclick="closeErrorMsg()"></i>`;
    errorMsg.classList.add('show');
    return;
  }

  // check if string match email pattern
  if (!subscriber.checkValidity()) {
    errorMsg.innerHTML = `<span>${subscriber.validationMessage}</span> <i class="ti ti-close" onclick="closeErrorMsg()"></i>`;
    ( !errorMsg.classList.contains('show') ) ? errorMsg.classList.add('show') : errorMsg.classList.add('');
    return;
  }

  // *send subscriber email to backend server to store in newsletter DB*

  // If all backend transactions is successful, show succcess message
  succcessMsg.classList.add('show-flex');
};

// close newsletter success message
const closeNewsletterSuccessMsg = () => {
  const succcessMsg = query(document, '.subscriber-confirmation-msg');
  succcessMsg.classList.remove('show-flex');
};

// close error message
const closeErrorMsg = () => {
  const errorMsg = query(document,'.error-msg');
  errorMsg.classList.remove('show');
};

// ======*** Newsletter subscription Ends  ***======


// ======*** Event listeners ***======
document.addEventListener('DOMContentLoaded', () => {
  // small navigation menu bar
  smallNav();

  if ((window.location.origin + '/') == window.location.href ) {
    // for hero image auto rotation on the home page
    heroImgRotate();

    // truncate news & events texts description (run on site's home page only)
    shortNewsAndEventTxt();

    // truncate about sch. & principal's words description text
    let checkMediaDevice = window.matchMedia("(max-width: 500px)");
    if(checkMediaDevice.matches) {
      // for about sch.
      const aboutSchTxt = query(document, '#secSection .description');
      aboutSchTxt.innerText = truncateText(aboutSchTxt.innerText, 60);
  
      // for principal's words 
      const principalTxt = query(document, '.fourth-section .description');
      principalTxt.innerText = truncateText(principalTxt.innerText, 60);
    }
    
    // lazyload desired elements on the home page
    // const lazyloadEle = queryAll(document, '[data-intersect]');
    // lazyloadEle.forEach(lazyLoading);
  }
});

