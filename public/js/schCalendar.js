/* 
  @Desc:
  =====================================================================
  Please note:
  All the data projected in the school calendar are dummy data
  from the 'events_and_news_mocked_data.json' file in the js directory 
  Hence; the event's date, title, & description in the modal window 
  is derived from this json file for prove of concept.
  the json file should be replaced with real sch's data or derived data is 
  to be gotten from sch's real-time database for more realistic approach
  if is to be transition to production phase of the project.
  =====================================================================
*/

// toggle each accordion body when an accordion header is clicked
const toggleAccordion = (ele) => {
  const accordions = queryAll(document, ".accordion-header");
  
  accordions.forEach(item => {
    item.addEventListener('click', () => {
      // show/hide accordion body
      item.nextElementSibling.classList.toggle('hide')
      item.children[1].classList.toggle('icon-indicator')
    })
  });
};

// close event modal
const closeEventModal = (eventModalId) => {
  let modalParent = id(eventModalId);
  let modal = query(modalParent, '.event-modal-content');

  // animate modal to close
  modal.classList.add('event-modal-anim-hide');

  // close the modal window frame out of view after 4sec.
  setTimeout(() => {
    modalParent.style.display = 'none';
    modal.classList.remove('event-modal-anim-hide');
  }, 400);

  return;
};

// open event modal
const openEventModal = async (e) => {
  // get event's id (with the alias 'eventId')
  let { id: eventId } = e.dataset;

  // get the event from the server with that ID
  let uri = `${window.location.origin}/public/js/events_and_news_mocked_data.json`;
  let res = await (await fetch(uri)).json();

  // filter out the event with the required id
  let data = res.find((ev) => ev.id === Number.parseInt(eventId));

  // de-structure data obj for easier use
  let { date, title, description } = data;

  // event date formating
  let evDateFrmt = checkDiffInDate(date.from, date.to);
  let evDate = (evDateFrmt.max) ? `${evDateFrmt.min} - ${evDateFrmt.max}`: evDateFrmt.min;

  // get all modal element  required
  const modal =  id('eventModal');
  let eventMonth = query(modal, '.event-date h4');
  let eventDate = query(modal, '.event-date h2');
  let eventTitle = query(modal, '.event-title');
  let eventBody = query(modal, '.event-modal-body');
  
  // interpolate
  eventMonth.innerHTML = monthsArr[new Date(date.from).getMonth()];
  eventDate.innerHTML = evDate;
  eventTitle.innerHTML = title;
  eventBody.innerHTML = `<p class="description">${description}</p>`
  modal.style.display = 'inherit';
  // console.log(data);
};

// checks diff btw dates for highest & lowest
const checkDiffInDate = (d1, d2) => {
  let date1 = new Date(d1).getDate();
  let date2 = new Date(d2).getDate();
  let data, max, min;
  // check for min & max value
  max = Math.max.apply(Math, [date1, date2]);
  min = Math.min.apply(Math, [date1, date2]);

  data = {min, max};
  return data;
};

// filter events by session and term
const filterByTerm = (session, term, arr) => {
  let data;

  data = arr.filter(ele => {
    if(ele.session == session && ele.term == term) return ele;
  });

  return data;
};

// event node template
const eventTemplate = ({ id, date, time, title, priority, venue }) => {
  // event date
  let chkDate = checkDiffInDate(date.from, date.to);
  let dateFrom = chkDate.min;
  let dateTo = chkDate.max ? `- ${chkDate.max}` : '';

  // event month formating
  let eventMonth = new Date(date.from).toDateString().split(' ')[1];

  let template = `
    <div class="event ${priority}" data-id="${id}" onclick="openEventModal(this)">
      <div class="event-date">
        <span>${eventMonth}</span> <span>${dateFrom} ${dateTo}</span>
      </div>
      <div class="event-title">
        ${title}
      </div>
      <div class="event-time-venue">
        <div class="time-venue">
          <span>${time.from} - ${time.to}</span> <span>${venue}</span>
        </div>
        <!-- read more CTA btn -->
        <i class="ti ti-arrow-right"></i>
      </div>
    </div>
  `;

  return template;
};

// fetch sch events from server/database
const fetchEvents = async (eventTerm) => {
  const uri = `${window.location.origin}/public/js/events_and_news_mocked_data.json`;
  let res, data, termEvents;

  try {
    res = await (await fetch(uri)).json();
  } catch (err) {
    console.log(`Error fetching data: ${err}`);
  }

  // filter out news or events in relation to parameter given
  data = res.filter(evnt => evnt.tag === 'event');

  // term events
  termEvents = filterByTerm('2020/2021', eventTerm, data);
 
  // help output into required DOM element
  // termEvents.forEach(ev => {
  //   console.log(eventTemplate(ev))
  // });

  // console.log(termEvents);
};

// array of months
let monthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// call toggle function on each accordion on page
if (query(document, ".accordion .accordion-header")) {
  toggleAccordion();
}