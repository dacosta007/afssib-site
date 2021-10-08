// help toggle answers to questions in the FAQ section
function toggleAnswer(event) {
  // accordion question clicked upon
  let questionEle = event.target;
  // variable for the answer tag element
  let getNextSibling = '';

  // first close all the open answers
  queryAll(document ,'.accordion-container .accordion .answer').forEach(ele => {
    // remove question 'active' class
    ele.previousElementSibling.classList.remove('active');
    ele.previousElementSibling.children[1].classList.remove('ti-minus');
    // close answer
    ele.style.maxHeight = null;
  });

  // to toggle the icon btwn '+' or '-'
  if (questionEle.tagName === 'I') {
    questionEle.classList.toggle('ti-minus');
  }
  if (questionEle.tagName === 'SPAN') {
    questionEle.nextElementSibling.classList.toggle('ti-minus');
  }
  if (questionEle.tagName === 'HEADER') {
    questionEle.children[1].classList.toggle('ti-minus');
  }

  // toggling 'active', & 'minus' class to the clicked question
  if (questionEle.tagName === 'SPAN' || questionEle.tagName === 'I') {
    getNextSibling = questionEle.parentElement.nextElementSibling;
    questionEle.parentElement.classList.toggle('active');
  }
  if (questionEle.tagName === 'HEADER') {
    getNextSibling = questionEle.nextElementSibling;
    questionEle.classList.toggle('active');
  }
  
  // show the answer to question
  if (getNextSibling.style.maxHeight) {
    getNextSibling.style.maxHeight = null;
  } else {
    getNextSibling.style.maxHeight = `${getNextSibling.scrollHeight}px`;
  }
  // console.log(questionEle.tagName, getNextSibling);
}

// all the accordion FAQ questions
const questions = queryAll(document, '.accordion .question');

// open answer to each question clicked upon
questions.forEach(question => {
  question.addEventListener('click', function(e) {
    toggleAnswer(e)
  })
});


/* ========== THE CONTACT FORM ========== */
const getFrmData = (frm) => {
  let frmEle = frm.elements;
  let frmData = {};
  // filter form with its name and value into frmData variable
  for (let i = 0; i < frmEle.length; i++) {
    frmData[frmEle[i].name] = frmEle[i].value;
  }

  // delete empty property
  delete frmData[""];

  // return submitted form data object
  return frmData;
};

const submitFrm = (event) => {
  // prevent form's submit default behaviour
  event.preventDefault();
  // the form
  const frm = event.target;
  // get submitted form's data
  let frmData = getFrmData(frm);
  // confirmation message
  let confirmMsg = query(document, '[data-confirmation-msg]');
  /* 
    **** 
    send the form's data as an email to the sch mail address 
    if all fields are filled correctly
    **** 
  */

  // display confirmation message
  confirmMsg.classList.toggle('hide');
  
  console.log(frmData);
};

// closes confirmation message on sent message
const closeMsg = () => {
  const confirmMsg = query(document, '[data-confirmation-msg]');
  const frm = query(document, '[data-contact-form]');

  // reset all the form input fields
  frm.reset();
  // close the confirmation message
  confirmMsg.classList.toggle('hide');
};

const contactFrm = query(document, '[data-contact-form]');
contactFrm.addEventListener('submit', function(event) {
  submitFrm(event)
});