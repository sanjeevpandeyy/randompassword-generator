const inputslider = document.querySelector("[data-lengthslider]");
const lengthdisplay = document.querySelector("[data-lengthnum]");



const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copymsg]");



const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbol");


const indicator = document.querySelector("[data-strengthindicate]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
let checkCount = 0;


//indicator color
setindicator("#ccc")

// set password length
function handleslider() {
  inputslider.value = passwordLength;
  lengthdisplay.innerText = passwordLength;
  const min=inputslider.min;
  const max=inputslider.max;
  inputslider.style.backgroundSize=((passwordLength-min)*100/(max-min)) +"% 100%"
}
handleslider();



function setindicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0 0 10px 2px ${color}`;
}



function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandonNumber() {
  return getRndInteger(0, 10);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

function generateSymbol() {
  const t = getRndInteger(0, symbols.length);
  return symbols.charAt(t);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setindicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setindicator("#ff0");
  } else {
    setindicator("#f00");
  }
}



async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);

    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }

  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}
function handleCheckBoxChange() {
  checkCount = 0;

  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleslider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputslider.addEventListener("input", (e) => {
  passwordLength = Number(e.target.value);
  handleslider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleslider();
  }

  password = "";

  let funcArr = [];

  if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
  if (numbersCheck.checked) funcArr.push(generateRandonNumber);
  if (symbolsCheck.checked) funcArr.push(generateSymbol);

  // compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  // remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  // shuffle password
  password = shuffle(Array.from(password));

  // show password
  passwordDisplay.value = password;

  // calculate strength
  calcStrength();
});


function shuffle(array) {

  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));

    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array.join("");
}