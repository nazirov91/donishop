var list = [];
var pageList = [];
var currentPage = 1;
var numberPerPage = 1;
var numberOfPages = 0;

function makeList() {
  for (x = 1; x <= 10; x++)
    list.push(x);
  numberOfPages = getNumberOfPages();
}

function getNumberOfPages() {
  return Math.ceil(list.length / numberPerPage);
}

function nextPage() {
  currentPage += 1;
  loadList();
}

function previousPage() {
  currentPage -= 1;
  loadList();
}

function firstPage() {
  currentPage = 1;
  loadList();
}

function lastPage() {
  currentPage = numberOfPages;
  loadList();
}

function pageNumber(number){
  currentPage = number;
  loadList();
}

function loadList() {
  var begin = ((currentPage - 1) * numberPerPage);
  var end = begin + numberPerPage;

  pageList = list.slice(begin, end);
  drawList();
  check();
}

function drawList() {
  document.getElementById("list").innerHTML = "";
  for (r = 0; r < pageList.length; r++) {
    document.getElementById("list").innerHTML += pageList[r] + "<br>";
  }
}

function check() {
  document.getElementById("next").disabled = currentPage === numberOfPages;
  document.getElementById("previous").disabled = currentPage === 1;
  document.getElementById("first").disabled = currentPage === 1;
  document.getElementById("last").disabled = currentPage === numberOfPages;
}

function load() {
  makeList();
  loadList();
}

window.onload = load;
