// subscription to AFSSAA newsletter
const communityNewsletter = () => {
  const subscriber = id('subscriberEmail');
  const userConsent = id('userConsent');
  const errorMsg = query(document, '.error-msg');
  const successMsg = query(document, '[data-confirmation-msg]');

  // check if subscriber's email & agreement are both filled
  if(subscriber.value === "" || userConsent.checked === false) {
    errorMsg.innerHTML = `
      <div>
        Please fill in your <b>Email Address correctly!</b>, and make sure you <b>agree</b> to the subscription 
        <i class="ti ti-close" onclick="closeErrMsg()" style="top: 6px;"></i>
      </div>
    `;
    // show error message
    errorMsg.classList.toggle('show');
    return;
  }

  // if email pattern is matched
  if(!subscriber.checkValidity()) {
    errorMsg.innerHTML = `<div>${subscriber.validationMessage}</div> <i class="ti ti-close" onclick="closeErrMsg()" style="top: 6px;"></i>`;
    (!errorMsg.classList('show')) ? errorMsg.classList.toggle('show') : errorMsg.classList.add('');
    return;
  }

  // *send subscriber email to backend server to store in newsletter DB*

  // If all backend transactions is successful, show succcess message
  successMsg.classList.toggle('show');
};

// close error message
const closeErrMsg = () => {
  const errorMsg = query(document, '.error-msg');
  errorMsg.classList.toggle('show');
};

// close confirmation message
const closeMsg = () => {
  const msg = query(document, '[data-confirmation-msg]');
  const subscriber = id('subscriberEmail');
  const userConsent = id('userConsent');
  // clear the input field & checkbox
  subscriber.value = '';
  userConsent.checked = false;
  // close confirmation message
  msg.classList.toggle('show');
};