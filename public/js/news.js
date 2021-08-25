// help format news date
const formatNewsDate = (date) => {
  let strDt = new Date(date).toDateString();
  let arrDt = strDt.split(' ');
  // removes the day(which is the first one in the array)
  arrDt.shift();
  // convert reset of the array value back to readable string
  let dt = arrDt;
  return dt.join(' ');
}

// help get news from news data source(i.e from a DB or JSON file)
const fetchNews = async () => {
  let news = [];
  try {
    let uri = '/public/js/events_and_news_mocked_data.json';
    let res = await fetch(uri);
    let data = await res.json();
    news = data;
  } catch (error) {
    console.log(error)
  }
  return news;
}

const filterNews = async (session, term) => {
  let count = 0;
  let arr1 = [], arr2 = [], arr3 = [], arr = [];
  let news, allNews;

  // get all news
  try {
    allNews = await fetchNews();
    
    // filter required news
    allNews.filter(news => {
      if (news.tag === 'news' && news.session === `${session}` && news.term === `${term}`) {
        arr.push(news);
      }
    });

    // not to complicate names
    news = arr;
    // help put news into required arrarys(for the DOM grid sake, showing the news)
    for (let i = 0; i < news.length; i++) {
      // when 'count' should not be more than counts of total DOM element to put content into
      if (count > 2) {
        count = 0;
      }
      if (count === 0) {
        arr1.push(news[i]);
      }
  
      if (count === 1) {
        arr2.push(news[i]);
      }
  
      if (count === 2) {
        arr3.push(news[i]);
      }
      // increment count
      count++;
    }

    // console.log(arr1, arr2, arr3);
    return  { col1: arr1, col2: arr2, col3: arr3 };
  } catch (error) {
    console.warn(error);
  }
}

// templates for showing news in the DOM
const templateWithImg = ({ id, img, title, session, date}) => {
  let formatDate = formatNewsDate(date.to);
  let template = `
    <div class="news with-img" data-news-id="${id}">
      <!-- news img -->
      <img src="${img}" loading="lazy" alt="news img" width="300" height="auto">
      <!-- news title, session, & date -->
      <div class="news-title-and-date" onclick="previewNews(event)">
        <h3 class="sub-title">${title}</h3>
        <div class="session-and-date">
          <span class="session">${session}</span>
          <span class="date">${formatDate}</span>
        </div>
      </div>
    </div>
  `;

  return template;
}

const templateWithoutImg = ({ id, title, session, date}) => {
  let formatDate = formatNewsDate(date.to);
  let template = `
    <div class="news without-img" data-news-id="${id}">
      <div class="news-title-and-date" onclick="previewNews(event)">
        <h3 class="sub-title">${title}</h3>
        <div class="session-and-date">
          <span class="session">${session}</span>
          <span class="date">${formatDate}</span>
        </div>
      </div>
    </div>
  `;

  return template;
}

// help show news in the DOM
const showAllNews = () => {
  // DOM elements to display news
  const newsColOne = query(document, '[data-news-col-one]');
  const newsColTwo = query(document, '[data-news-col-two]');
  const newsColThree = query(document, '[data-news-col-three]');

  filterNews('2020/2021', 'third')
    .then(res => {
      let { col1, col2, col3 } = res;

      // populate the DOM elements with the news data
      col1.forEach(news => {
        // news without image
        if (!news.img) {
          newsColOne.innerHTML += templateWithoutImg(news);
        }

        // news with image
        newsColOne.innerHTML += templateWithImg(news);
      });

      col2.forEach(news => {
        // news without image
        if (!news.img) {
          newsColTwo.innerHTML += templateWithoutImg(news);
        }

        // news with image
        newsColTwo.innerHTML += templateWithImg(news);
      });

      col3.forEach(news => {
        // news without image
        if (!news.img) {
          newsColThree.innerHTML += templateWithoutImg(news);
        }

        // news with image
        newsColThree.innerHTML += templateWithImg(news);
      });
    })
  ;
  
}

// preview/show news in modal window
const previewNews = async (event) => {
  const newsId = event.target.parentElement.dataset.newsId;
  const newsUri = '/public/js/events_and_news_mocked_data.json';
  // fetch news with that id in the news DB or JSON file
  let res, data;
  try {
    res = await fetch(newsUri);
    data = await res.json();
  } catch (error) {
    console.warn(`Error: ${error}`);
  }

  // filter news with the given id
  let theNews = data.find(news => news.id === parseInt(newsId));
  let { tag, title, subTitle, description, img} = theNews;
  let date = formatNewsDate(theNews.date.to);

  // populate news modal window with the news data
  const newsModal = query(document, '#previewEventsNews');
  const newsImg = query(newsModal, '[data-news-img]');
  const newsTag = query(newsModal, '[data-news-tag]');
  const newsTitle = query(newsModal, '[data-news-title]');
  const newsSubTitle = query(newsModal, '[data-news-sub-title]');
  const newsDate = query(newsModal, '[data-news-date]');
  const newsDescription = query(newsModal, '[data-news-description]');

  newsImg.style.backgroundImage = `url(${img})`;
  newsTag.innerText = tag;
  newsTitle.innerText = title;
  newsSubTitle.innerText = subTitle;
  newsDate.innerText = date;
  newsDescription.innerText = description;

  // show/display news modal window.
  openNewsModal();
}

document.addEventListener('DOMContentLoaded', () => { showAllNews() })