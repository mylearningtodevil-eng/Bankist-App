'use strict';

// Accounts Data
const account1 = {
  owner: 'Amjad Javed',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementDates: [
    '1/1/2025',
    '3/2/2025',
    '3/2/2025',
    '23/3/2025',
    '25/4/2025',
    '12/5/2025',
    '14/5/2025',
    '15/6/2025',
  ]
};

const account2 = {
  owner: 'Ahmad Raza',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementDates: [
    '11/2/2025',
    '2/3/2025',
    '10/2/2025',
    '3/3/2025',
    '1/4/2025',
    '2/4/2025',
    '4/6/2025',
    '15/6/2025',
  ]
};

const account3 = {
  owner: 'Nouman Arif',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementDates: [
    '10/1/2025',
    '30/2/2025',
    '13/3/2025',
    '23/3/2025',
    '5/4/2025',
    '20/4/2025',
    '18/5/2025',
    '5/6/2025',
  ]
};

const account4 = {
  owner: 'Fahad Abdul Razaq',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementDates: [
    '2/3/2025',
    '12/4/2025',
    '23/4/2025',
    '7/5/2025',
    '25/5/2025',
  ]
};

const account5 = {
  owner: 'Subhan Ali Tahir',
  movements: [2333, 122, -1222, 9000, -4000, 50],
  interestRate: 3,
  pin: 5555,
  movementDates: [
    '18/1/2025',
    '30/2/2025',
    '13/3/2025',
    '30/4/2025',
    '27/5/2025',
    '20/6/2025',
  ]
};
const accounts = [account1, account2, account3, account4, account5];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const closeModal = document.querySelector('.close-modal');
const modal = document.querySelector('.modal');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
let currentAccount,timerLogin;
const locate = navigator.language;
const now = new Date();
const finalDate = new Intl.DateTimeFormat(locate).format(now);
labelDate.textContent = finalDate;
// Functions
const hideModal = function (){
  modal.classList.add('hidden');
}
const userMaker = function () {
  accounts.forEach(function (acc) {
    const userID = acc.owner
      .toLowerCase()
      .split(' ')
      .map(el => el.slice(0, 1))
      .join('');
    acc.username = userID;
  });
};
userMaker();
const loginTimer = function(){
  // Set the timer to 5 minutes
let time = 300;
const tick = () => {
  let min = `${Math.trunc(time/60)}`.padStart(2,0);
  let sec = `${Math.trunc(time%60)}`.padStart(2,0);
  labelTimer.textContent = `${min}:${sec}`;
  if(time===0){
    clearInterval(timer);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Login to get started';
  }
  time--;
}
  // Call the timer every second
  tick(); 
const timer = setInterval(tick, 1000);
return timer;
  // In each call display the timer

  // When it is zero logout
}
const displayMovement = function (acc, sorted = false) {
  containerMovements.innerHTML = '';
  const mov = sorted
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  mov.forEach(function (mov, i) {
    const typeMovement = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${typeMovement}">${
      i + 1
    } deposit</div>
     <div class="movements__date">${acc.movementDates[i]}</div>
          <div class="movements__value">${mov}</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const transferAmount = function (acc) {
  acc.preventDefault();
  console.log('Transfer Function is running.');
  const amount = Number(inputTransferAmount.value);
  const reciverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    reciverAccount !== currentAccount &&
    amount > 0 &&
    currentAccount.balance > amount
  ) {
    console.log('Transfer Granted');
    currentAccount.movements.push(-amount);
    reciverAccount.movements.push(amount);
    currentAccount.movementDates.push(finalDate);
    reciverAccount.movementDates.push(finalDate);
     clearInterval(timerLogin);
    timerLogin = loginTimer();
    updateUI(currentAccount);
    inputTransferAmount.value = '';
    inputTransferTo.value = '';
  }
};
const closingAccount = function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    console.log('Correct Credential');
    const index = accounts.findIndex(
      el => el.username === currentAccount.username
    );
    accounts.splice(index, 1);
    inputClosePin.value = '';
    inputCloseUsername.value = '';
    labelWelcome.textContent = 'Login to get stated';
    containerApp.style.opacity = 0;
  }
};
const totalBalnce = function (acc) {
  const balanceValue = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balanceValue}€`;
  currentAccount.balance = Number(balanceValue);
};
const calcSummary = function (acc) {
  const deposits = acc.movements
    .filter(el => el > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const withdrawal = acc.movements
    .filter(el => el < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${deposits}€`;
  labelSumOut.textContent = `${Math.abs(withdrawal)}€`;
  const interestCalc = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${parseFloat(interestCalc).toFixed(2)}€`;
};
const updateUI = function (acc) {
  displayMovement(acc);
  totalBalnce(acc);
  calcSummary(acc);
};

const loanGiver = function (acc) {
  acc.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    currentAccount.movementDates.push(finalDate);
    clearInterval(timerLogin);
    inputLoanAmount.value = '';
    timerLogin = loginTimer();
    updateUI(currentAccount);
  }
};
const loginCheck = function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (Number(inputLoginPin.value) === currentAccount.pin) {
    containerApp.style.opacity = 100;
    hideModal();
    labelWelcome.innerHTML = `Welcome back ${currentAccount.owner
      .split(' ')
      .join(' ')}`;
    updateUI(currentAccount);
    if(timerLogin) clearInterval(timerLogin);
    timerLogin =loginTimer();
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
  }
};
btnLogin.addEventListener('click', loginCheck);
btnTransfer.addEventListener('click', transferAmount);
btnClose.addEventListener('click', closingAccount);
btnLoan.addEventListener('click', loanGiver);
closeModal.addEventListener('click',hideModal)
let sort;
btnSort.addEventListener('click', function () {
  displayMovement(currentAccount, !sort);
  sort = !sort;
});
