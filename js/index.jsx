"use strict";

const elBudgetForm = document.querySelector(".budget__form");
const elBudgetFormInput = document.querySelector(".budget__input");
const elBudget = document.querySelector(".budget");
const elExpenses = document.querySelector(".expenses");
const elBalance = document.querySelector(".balance");

const elStoryForm = document.querySelector(".story_form");
const elExpenseInput = document.querySelector(".expense_input");
const elAmountInput = document.querySelector(".amount_input");
const elExpensesList = document.querySelector(".expenses__list");

let budget = [];
let expenses = [];

let balanse = [] || 0;

const expensesStroge = JSON.parse(window.localStorage.getItem("newExpenses"));
const newExpenses = expensesStroge || [];

elBalance.textContent =
  budget.reduce((acc, item) => acc + item, 0) -
  expenses.reduce((acc, item) => acc + item, 0);

elBudgetForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const budgetFormInputValue = Number(elBudgetFormInput.value.trim());
  budget.push(budgetFormInputValue);

  window.localStorage.setItem("budget", JSON.stringify(budget));

  let calcBudget = budget.reduce((acc, item) => acc + item, 0);
  elBudget.textContent = calcBudget;

  let calcBalance =
    calcBudget -
    expenses.reduce((acc, item) => acc + item, 0)
  elBalance.textContent = calcBalance;

  elBudgetFormInput.value = null;
});

const renderExpenses = function (arr, htmlElement) {
  arr.forEach((item) => {
    const newItem = document.createElement("div");
    const newTitle = document.createElement("h5");
    const newValue = document.createElement("p");
    const newChanges = document.createElement("div");
    const newChangesImg = document.createElement("img");
    const newChangesDeleteImg = document.createElement("img");

    newItem.setAttribute(
      "class",
      "list-group-item mb-3 row d-flex justify-content-around"
    );
    newTitle.setAttribute("class", "m-0 col-md-4 text-center");
    newTitle.textContent = item.title;
    newValue.setAttribute("class", "m-0 col-md-4 text-center fw-semibold");
    newValue.textContent = `$ ${item.amount}`;
    newChanges.setAttribute("class", "col-md-4 text-center");
    newChangesImg.setAttribute("class", "me-2 p-2");
    newChangesImg.setAttribute("src", "./img/edit.png");
    newChangesImg.style.width = "36px";
    newChangesDeleteImg.setAttribute("class", "delete__btn p-2");
    newChangesDeleteImg.setAttribute("src", "./img/delete.jfif");
    newChangesDeleteImg.style.width = "36px";

    newChangesDeleteImg.dataset.deleteBtnId = item.id;

    const calcExpenses = expenses.reduce((acc, item) => acc + item, 0);
    elExpenses.textContent = calcExpenses;

    elBalance.textContent =
      budget.reduce((acc, item) => acc + item, 0) -
      expenses.reduce((acc, item) => acc + item, 0);

    htmlElement.appendChild(newItem);
    newItem.appendChild(newTitle);
    newItem.appendChild(newValue);
    newItem.appendChild(newChanges);
    newChanges.appendChild(newChangesImg);
    newChanges.appendChild(newChangesDeleteImg);
  });
};
renderExpenses(newExpenses, elExpensesList);

elStoryForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const expensesInputValue = elExpenseInput.value;
  const amountInputValue = elAmountInput.value;

  const expensesStory = {
    title: expensesInputValue,
    amount: amountInputValue,
    id: newExpenses[newExpenses.length - 1]?.id + 1 || 0,
  };

  newExpenses.push(expensesStory);
  window.localStorage.setItem("newExpenses", JSON.stringify(newExpenses));

  expenses.push(expensesStory.amount * 1);
  window.localStorage.setItem("expenses", JSON.stringify(expenses));

  elExpenseInput.value = null;
  elAmountInput.value = null;
  elExpensesList.innerHTML = null;

  renderExpenses(newExpenses, elExpensesList);
});

elExpensesList.addEventListener("click", function (evt) {
  if (evt.target.matches(".delete__btn")) {
    const deleteId = evt.target.dataset.deleteBtnId * 1;
    const findItem = newExpenses.findIndex((item) => item.id === deleteId);
    newExpenses.splice(findItem, 1);

    window.localStorage.setItem("newExpenses", JSON.stringify(newExpenses));

    expenses.splice(findItem.amount, 1);
    window.localStorage.setItem("expenses", JSON.stringify(expenses));

    if (newExpenses.length === 0) {
      window.localStorage.removeItem("newExpenses");
      window.localStorage.removeItem("expenses");
    }

    const calcExpenses = expenses.reduce((acc, item) => acc + item, 0);
    elExpenses.textContent = calcExpenses;

    let calcBalance =
      budget.reduce((acc, item) => acc + item, 0) - calcExpenses;
    elBalance.textContent = calcBalance;

    elExpensesList.innerHTML = null;
    renderExpenses(newExpenses, elExpensesList);
  }
});
