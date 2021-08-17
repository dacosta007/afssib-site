/* ======
@desc:
Below is a mocked data representation of products available for sale
Note: real data is to be derived/gotten from a database or a json file
on/off the server, this sites resides.
====== */
const getAllProdts = async () => {
  let res;
  let uri = `${window.location.origin}/public/js/products.json`;
  try {
    res = await (await fetch(uri)).json();
  } catch (error) {
    console.warn(`Error ${error.name}: ${error.message}`)
  }
  return res;
  // console.log(data)
}


const products = [
  {
    id: 'Ax5o8f',
    name: 'male overall uniform',
    description: 'Here is the overall male\'s school uniform, which present our male students quite elegantly, and smart. The overall uniform consist of a pair shirt, jump-jacket, trouser, cardigan, and a pullover sweater. All these gives a perfect completeness to our male students in AFSS, Ibadan.',
    img: '/public/img/male-overall-uniform.jpg',
    imgCreator: { name: 'Rhii Photography', imgRef: 'https://unsplash.com/@rhii?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText' },
    sizes: ['xs', 's', 'm', 'l', 'xl'],
    prices: { xs: 9500, s: 14500, m: 16500, l: 18500, xl: 20500 }
  },
  {
    id: 'IAdBW4',
    name: 'female uniform',
    description: 'This is the female complete uniform, which are a complusory uniform to gear to have. In It we you\ll be getting a pair shit, jump-jacket, skirt, and a cardigan. All these makes up an AFSS, Ibadan female school uniform',
    img: '/public/img/female-uniform.jpg',
    imgCreator: { name: 'Rhii Photography', imgRef: 'https://unsplash.com/@rhii?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText' },
    sizes: ['xs', 's', 'm', 'l', 'xl'],
    prices: { xs: 7500, s: 9500, m: 11500, l: 13500, xl: 15500 }
  },
  {
    id: 'USmprO',
    name: 'female overall uniform',
    description: 'Here is the overall female\'s school uniform, which help model our female students more elegantly. The overall school uniform comprises of a shit, jump-jacket, skirt, tie, cardigan, and a pullover sweeter. These help complete the female uniform of AFSS, Ibadan.',
    img: '/public/img/femal-overall-uniform.jpg',
    imgCreator: { name: 'Rhii Photography', imgRef: 'https://unsplash.com/@rhii?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText' },
    sizes: ['xs', 's', 'm', 'l', 'xl'],
    prices: { xs: 9500, s: 14500, m: 16500, l: 18500, xl: 20500 }
  },
  {
    id: 'afJZIv',
    name: 'school uniform ties',
    description: 'this is the official school uniform ties which are worn on school\'s uniform and other school\'s wears. All this are modelled to fit perfectly',
    img: '/public/img/sch-uniform-ties.jpg',
    imgCreator: { name: 'Rhii Photography', imgRef: 'https://unsplash.com/@rhii?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText' },
    sizes: ['xs', 's', 'm', 'l', 'xl'],
    prices: { xs: 1500, s: 2500, m: 3500, l: 4500, xl: 5500 }
  }
]

/* ======
this help save product item into the 'cartItems' localStorage
hence, it also gives appropriate data format by which each product
item is saved into the storage
====== */
const saveProdItem = () => {
  const prodId = query(document, '[data-prod-item-id]').getAttribute('data-prod-item-id');
  const prodItem = products.find(item => item.id === `${prodId}`);
  let itemQty = parseInt(query(document, '[data-prod-qty]').innerText);
  let size = query(document, '.uniform-sizes input:checked');

  // check if a size is selected
  if (size === null || size === undefined) {
    alert('Please select a "size" fitting for your child')
    console.warn('Please try select a preferable size fitting for your child')
    return;
  }

  size = size.dataset.prodSize;
  let price = prodItem.prices[size];
  let { id, name, img } = prodItem;

  let itemsArr = [], data, store;
  let chkStorage = localStorage.getItem('cartItems');

  // if localStorage('cartItems') is yet to be set
  if (chkStorage === null || chkStorage === undefined) {
    itemsArr.push({ id, name, img, size, price, quantity: itemQty })
    // format for data storage
    data = { items: itemsArr, total: { quantities: 1, price } }
  }

  // if localStorage('cartItems') is set: update data with new values
  if (chkStorage != null || chkStorage != undefined) {
    store = JSON.parse(chkStorage);
    let { items, total } = store;
  
    // filter out duplicate value/items already added into cart
    let chkItem = items.some(item => item.id === id)
    if (chkItem) {
      console.warn(`${chkItem}: this item is already added to cart!`)
      return;
    } else {
      console.log(`${chkItem}: Item not in cart yet`)
      items.push({ id, name, img, size, price, quantity: itemQty })
      data = { items, total };
    }
  }
  
  // save the formatted data into storage
  localStorage.setItem('cartItems', JSON.stringify(data));
  console.log(data)

  // update data total cart items count in the DOM
  showTotalCartItems();
  console.log(`save product item with ID: ${prodId} ✔😃`)
  
  /* ==== FOR DEBUGGING ====
  try {
    if (datas === undefined) throw  `No ID with '${prodId}'`;
  } catch(err) {
    console.warn(`${err.name}: ${err.message}`)
  } 
  ========*/
}


/* ======
@desc:
this method helps to show the modal window to preview the product clicked
upon. 
======*/
const previewProd = (prodId) => {
  const prodt = products.find(prod => prod.id === prodId);
  const prodModal = query(document, '.uniform-modals-container .modal');
  const prodItemId = query(prodModal, '[data-prod-item-id]')
  const prodImg = query(prodModal, '[data-prod-img]');
  const prodDesc = query(prodModal, '[data-prod-description]');
  const prodSizes = query(prodModal, '[data-prod-sizes]');
  const prodAmt = query(prodModal, '[data-prod-amount]');
  const prodTotAmt = query(prodModal, '[data-total-amount]');

  /* set required DOM with appropriate values */
  prodItemId.dataset.prodItemId = prodId;
  prodImg.src = prodt.img;
  prodDesc.innerText = prodt.description;
  // first empty before populating with data
  let sizes = prodt.sizes;
  prodSizes.innerHTML = '';
  for (const size of sizes) {
    prodSizes.innerHTML += `
      <label for="${size}">
        <input type="radio" onclick="getProdItemSizePrice(event)" name="size" value="${size}" id="${size}" data-prod-size="${size}">
        <span class="label-text">${size.toUpperCase()}</span>
      </label>
    `
  }
  prodAmt.innerText = formatMoney(prodt.prices['xs'], 'NG', 'NGN');
  prodTotAmt.innerText = formatMoney(prodt.prices['xs'], 'NG', 'NGN');

  // display product window
  prodModal.classList.toggle('show');
}

/* ======
@desc:
help close product preview window
====== */
const closeProdPreview = () => {
  const prodModal = query(document, '.uniform-modals-container .modal');
  prodModal.classList.toggle('show')
}

/* ======
@desc:
this is the template method for describing the uniform container.
====== */
const productItemTemplate = ({ id, name, img, imgCreator }) => {
  let template = `
    <div class="uniform" onclick="previewProd('${id}')">
      <img src="${img}" alt="${imgCreator.name}" loading="lazy" width="300" height="auto">
      <div class="uniform-description">
        <span>${name}</span>
        <a href="${imgCreator.imgRef}">
          ${imgCreator.name}
        </a>
      </div>
    </div>
  `;

  return template;
}

/* ======
@desc:
this help display every available products in ready for sales on the page
====== */
const showProducts = async () => {
  const uniformContainer = query(document, '.uniforms-container')
  // get all product available for sale(either from a DB or JSON file)
  let prod
  try {
    prod = await (await fetch(`${window.location.origin}/public/js/products.json`)).json();
  } catch (error) {
    console.warn(error);
  }
  const prodts = prod;

  // populate the uniforms container with products available for sale
  uniformContainer.innerHTML = '';
  for (const prodt of prodts) {
    uniformContainer.innerHTML += productItemTemplate(prodt)
  }

  console.log('hurray! 🎊, populated the DOM successfully! 😃✔')
}

/* ======
@desc:
help get product item's price in accordance to selected size on the preview
modal window
====== */
const getProdItemSizePrice = (event) => {
  const prodId = query(document, '[data-prod-item-id]').dataset.prodItemId;
  const prodSz = event.target.dataset.prodSize;
  const prodt = products.find(item => item.id === prodId);
  const showAmtEle = query(document, '[data-prod-amount]');
  const showTotAmtEle = query(document, '[data-total-amount]');
  const showProdQty = query(document, '[data-prod-qty]');

  // get price and format to country currency. then, show it in the required dom
  let price = formatMoney(prodt.prices[prodSz], 'NG', 'NGN');
  showAmtEle.innerText = price;
  showTotAmtEle.innerText = price;
  showProdQty.innerText = 1;
}

/* ======
@desc:
this method helps increase/decrease product item 'quantity' in the product
preview modal window.
====== */
const prodItemQty = (num) => {
  const prodQtyEle = query(document, '[data-prod-qty]');
  const prodAmt = query(document, '[data-prod-amount]');
  const prodTotAmt = query(document, '[data-total-amount]');

  // remove currency symbol & convert to number
  let amt = prodAmt.innerText.slice(1)
  amt = parseInt(amt.split(',').join(''))
  let totalAmt;
  
  // calculate the sum total price by quantity provided
  let qty = parseInt(prodQtyEle.innerText) + (num) || 1;
  totalAmt = amt * qty;

  // update required DOM elements with current values
  prodQtyEle.innerText = qty;
  prodTotAmt.innerText = formatMoney(totalAmt, 'NG', 'NGN');
}

/* ======
@desc:
this helps to check items added inside the cart(in the localstorage)
and return all the propertities added inside the storage
====== */
const checkCartItems = () => {
  // Note: localStorage name = cartItems;
  let store = localStorage.getItem('cartItems');

  if(store == null || store == undefined) {
    return 0;
  }

  // get cart items & sum total of quantities and price
  let data = JSON.parse(store);

  return data;
}

/* ====== 
@desc:
helps reads total counts of items added in cart storage (cartItems)
====== */
const readItemsCounts = () => {
  let store = checkCartItems();

  if (store === 0) {
    return 0;
  }

  // all cart items(array value)
  let { items } = store;

  // returns total counts items added in cart storage
  return items.length;
}


/* ======
@desc:
this method helps update the total quantities & price
added into the cart storage(localStorage => 'cartItems')
====== */
const updateTotalprice = () => {
  const store = checkCartItems();
  let { items, total } = store;
  let data;
  let totalPrice = 0;
  let totalQty = 0;

  // calculate sum total of items price and quantities
  for (const i of items) {
    totalPrice += (i.price * i.quantity)
    totalQty += i.quantity
  }

  // update cart total analysis
  total.price = totalPrice;
  total.quantities = totalQty;

  // update required DOM elements to display updated value
  let totalCartPrice = query(document, '[data-cart-total-price]');
  let totalCartQty = query(document, '[data-cart-total-qty]');

  totalCartPrice.innerText = formatMoney(total.price, 'NG', 'NGN');
  totalCartQty.innerText = total.quantities;

  // save the updated values into storage
  data = { items, total };
  localStorage.setItem('cartItems', JSON.stringify(data));

  console.log('data is now updated successfully! ✔😃')
}

/* ======
@desc: 
this method help delete all what is added into the 'cartItems' storage
(localStorage)
====== */
const deleteCartStorage = () => {
  if(localStorage.removeItem('cartItems')) {
    return true;
  } else {
    console.warn('No such storage exited!')
    return;
  }
}

/* ======
@desc:
help delete marked item in the cart storage and cart item DOM element
====== */
const deleteCartItems = () => {
  // container for all cart items 
  const cartItemsContainer = query(document, '.cart-items');
  // every cart items selected 
  const cartItems = queryAll(cartItemsContainer, '.item input:checked');
  // cart storage
  const store = checkCartItems();
  let { items, total } = store;
  let data;

  // delete items with such id provided from the cart & DOM
  for (const item of cartItems) {
    // remove element with selected id from the DOM
    query(cartItemsContainer, `[data-cart-item-id='${item.value}']`).remove()
    // filter out items with provided/selected id's 
    items = items.filter(ele => ele.id != item.id)

    console.log(`item with ID: '${item.value}' is removed! 👍`)
  }

  // update the cart storage with remaining filtered data
  data = { items, total };
  localStorage.setItem('cartItems', JSON.stringify(data));

  // re-evaluate remaining total item quantities & price to be paid for.
  updateTotalprice();

  // show remaining item's count in cart
  showTotalCartItems();
}

/* ======
@desc:
This method will mark/select all items in cart, then when the delete icon
button is clicked, all selected/marked items will be deleted
====== */
const selectAllCartItems = () => {
  // container for all cart items 
  const cartItemsContainer = query(document, '.cart-items');
  // every cart items selected 
  const cartItems = queryAll(cartItemsContainer, '.item input');

  // mark all items listed in the cart 
  for (const item of cartItems) {
    if (item.checked != true){
      item.checked = true;
    } else {
      item.checked = false;
    }
  }
}

/* ======
@desc:
this method create random generated alphanumeric string. Note, it
isn't all that unique, hence; an alternative method or package could
be use (an npm package like 'uuid')
====== */
const genRandId = (num) => {
  var capLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var smaLetters = 'abcdefghijklmnopqrstuvwxyz'
  var nums = '0123456789'
  var alphaNumeric = capLetters + smaLetters + nums
  
  let str = '';
  
  for(var i = 0; i < num; i++) {
 		let rand = Math.floor(Math.random() * alphaNumeric.length)
    str += alphaNumeric.charAt(rand)
  }
  
  return str;
}

/* ======
@desc:
this will help format the price according to the money currency specified 
====== */
const formatMoney = (money, countryCode, currencyFormat) => {
  let convertMoney = money
  .toLocaleString(
    `en-${countryCode}`, 
    {style: 'currency', currency: currencyFormat}
  );

  return convertMoney;
}

/* ======
@desc:
help display counts of items added in cart storage in the cart btn
====== */
const showTotalCartItems = () => {
  const itemCount = query(document, '[data-cart-items-count]');
  itemCount.innerText = readItemsCounts();
}

// help increase or decrease quantity item added to cart
const cartQty = (itemId, num) => {
  let store = checkCartItems();
  let { items, total } = store;
  let data;
  let totalQty = parseInt(total.quantities);

  // the appropriate DOM to update
  let cartQty = query(document, `[data-cart-qty='${itemId}']`);

  // update item with specified item id
  for (const i of items) {
    if (i.id === itemId) {
      i.quantity = parseInt(i.quantity) + num;
      // update DOM with updated quantity
      cartQty.innerText = i.quantity;

      if (i.quantity <= 1) {
        i.quantity = 1;
        // update DOM with updated quantity
        cartQty.innerText = i.quantity;
      }
    }
  }
  // update the item total quantity
  total.quantities = ((totalQty) + num) < 0 ? 0 : (totalQty) + num;
  data = { items, total };

  // save/update storage with new data
  localStorage.setItem('cartItems', JSON.stringify(data))
  
  // update the total items quantities & price to be payable
  updateTotalprice();
}

/* ======
@desc:
this help to create template to be rendered by in the DOM: displaying all items
added into cart
====== */
const cartItemTemplate = (data) => {
  // help format to country currency value
  let moneyFmt = formatMoney(data.price, 'NG', 'NGN');

  let template = `
    <div class="item" data-cart-item-id="${data.id}">
      <!-- a checkbox to mark item for delete(NOTE: checkbox value = item's id) -->
      <label for="${data.id}">
        <input type="checkbox" id="${data.id}" value="${data.id}">
      </label>
      <!-- item img & info -->
      <div>
        <!-- item img -->
        <div class="item-img">
          <img src="${data.img}" alt="cart_item_img" width="90" height="auto">
        </div>
        <div class="item-info">
          <!-- item name -->
          <div class="item-name">${data.name}</div>
          <!-- item size -->
          <div class="item-size">size <sup>'</sup>${data.size}</div>
          <!-- item price & quantity(can be increase or decrease) -->
          <div class="price-and-quantity-container">
            <span class="price">${moneyFmt}</span> 
            <span class="quantity">
              <button class="ti ti-minus decrease" onclick="cartQty('${data.id}', -1)"></button> 
              <span class="quantities" data-cart-qty="${data.id}">${data.quantity}</span> 
              <button class="ti ti-plus increase" onclick="cartQty('${data.id}', 1)"></button>
            </span>
          </div>
        </div>
      </div>
    </div>
  `;

  return template;
}

/* ======
@desc:
this method help showing window that list all the items added
to cart, all the quantities, and total price of all items added.
====== */
const showCartItems = () => {
  // required DOM elements to manipulate
  const cartContainer = query(document, '.cart-icon-and-item-container');
  const cartItemsContainer = query(cartContainer, '.cart-items-container');
  const cartIconBtn = query(document, '.cart-icon-btn');
  const cartItems = query(cartItemsContainer, '.cart-items');

  // cart storage
  let store = checkCartItems();
  
  // check if items are added to cart storage
  if(store === 0) {
    console.log('There no items added to cart yet!')
    return;
  }

  let { items, total } = store;

  // list all items added into cart
  cartItems.innerHTML = ''; // first clear what's in the DOM 
  items.forEach(item => {
    cartItems.innerHTML += cartItemTemplate(item)
  });

  // evaluate total price & quantities to be paid for
  updateTotalprice()

  // hide cart icon btn and show items added to cart
  cartContainer.classList.toggle('cart-container-height-adj');
  cartItemsContainer.classList.toggle('show');
  cartIconBtn.classList.toggle('hide');
}

/* ======
@desc:
this will close the cart items window if it is opened
====== */
const closeCart = () => {
  const cartContainer = query(document, '.cart-icon-and-item-container');
  const cartItemsContainer = query(cartContainer, '.cart-items-container');
  const cartIconBtn = query(document, '.cart-icon-btn');

  // hide cart icon btn and show items added to cart
  cartContainer.classList.toggle('cart-container-height-adj');
  cartItemsContainer.classList.toggle('show');
  cartIconBtn.classList.toggle('hide');

  console.log('close cart window btn clicked!')
}

/* ======
@desc:
this method triggers/show the 'place order form': to submit 
all items in the cart. It is added to the btn named
'proceed to order', which is on the window that shows all the items in cart.
====== */
const showOrderForm = () => {
  const cartItemsContainer = query(document, '.cart-items-container');
  const orderFormContainer = query(document, '.order-form-container');

  // hide cart items container & show order form container
  cartItemsContainer.classList.toggle('show');
  orderFormContainer.classList.toggle('show');
  // console.log('show order form btn clicked!')
}


/* get all valid form values */
const getOrderFormValues = () => {
  const frm = queryAll(document, '[data-order-form] input');
  let data = {}, errors = {};
  for (const inpt of frm) {
    if (inpt.checkValidity() && inpt.value != "") {
      data[inpt.name] = inpt.value;
    } else {
      errors[inpt.name] = inpt.value;
    }
  }

  return { data, errors }
}

/* validate input field */
const validateInpt = (event) => {
  const inptEle = event.target;
  const errorMsg = query(inptEle.parentElement, '[data-inpt-err-msg]');
  
  if (!inptEle.checkValidity() || inptEle.value === "") {
    errorMsg.innerText = inptEle.validationMessage;
    errorMsg.classList.toggle('show');
  } else {
    errorMsg.innerText = "";
    errorMsg.classList.remove('show');
  }
}

/* ======
@desc:
'placeOrder' method is for submitting the order form
with all cart data to appropriate backend API to handle, 
then help trigger confirmation message from the backend API
====== */
const placeOrder = () => {
  const frmData = getOrderFormValues();
  let { data , errors } = frmData;

  // check for errors on submitted form
  if (Object.keys(errors).length > 0) {
    alert('⚠Please fill in the fields with appropriate values')
    console.warn('🛑Please fill in the fields with appropriate values');
    return;
  }

  /* 
    open flutterwave payment gateway to make payment for wears
    through their credit/debit card.
  */

  /* 
    send reciept/invoice email to user/buyer mail address,
    and also to the sch's mail address on ordered items with
    user's/buyer's info, and transaction info
  */

  /* 
    get all the data info from the form and payment transaction
    and save them in the sch's transaction DB (If all is a success)
  */
  console.log(data);

  // empty all items added to cart & clear the form inputs
  // localStorage.removeItem('cartItems')
  query(document, '[data-order-form]').reset();


  /* 
    show confirmation message if all processes are satisfied
  */
  confirmationMsg();
}

// help go back to items in cart window
const goBackToCart = () => {
  const orderFormContainer = query(document, '.order-form-container');
  const cartItemsContainer = query(document, '.cart-items-container');
  orderFormContainer.classList.toggle('show');
  cartItemsContainer.classList.toggle('show');
}


/* ======
@desc:
helps display confirmation message when order form form items has been submitted
or placed
====== */
const confirmationMsg = () => {
  const orderFormContainer = query(document, '.order-form-container');
  const confirmationMsgContainer = query(document, '.order-confirmation-msg-container');

  // hide order form and show the confirmation message
  orderFormContainer.classList.toggle('show');
  confirmationMsgContainer.classList.toggle('show');
}

/* ======
@desc:
help close the confirmation message
====== */
const closeConfirmationMsg = () => {
  const cartContainer = query(document, '.cart-icon-and-item-container');
  const cartIconBtn = query(document, '.cart-icon-btn');
  const confirmationMsgContainer = query(document, '.order-confirmation-msg-container');

  confirmationMsgContainer.classList.toggle('show');
  cartContainer.classList.toggle('cart-container-height-adj');
  cartIconBtn.classList.toggle('hide');
}


/* ======
@desc: Event listeners
====== */
// display all products available for sale
query(document, '[data-prodts-available]').addEventListener('load', showProducts());

// display all items added into cart on the big cart button
query(document, '[data-cart-items-count]').addEventListener('DOMContentLoaded', showTotalCartItems());
