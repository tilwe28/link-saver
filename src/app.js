const inputEl = document.getElementById("input-el");
const saveBtn = document.getElementById("save-input-btn");
const savedUl = document.getElementById("saved-ul");
let links = [];
let storedLinks = JSON.parse(localStorage.getItem("links"));

if (storedLinks) renderLinks();

// Functions
saveBtn.addEventListener("click", save);
inputEl.addEventListener("keypress", function (e) {
  if (e.key == "Enter") save();
});
document.getElementById("save-tab-btn").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    inputEl.value = url;
    save();
  });
});
document.getElementById("save-all-btn").addEventListener("click", function () {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    tabs.forEach((tab) => {
      inputEl.value = tab.url;
      save();
    });
  });
});

function save() {
  if (!inputEl.value) return;

  links.push(inputEl.value);
  storedLinks = links;
  localStorage.setItem("links", JSON.stringify(storedLinks));

  inputEl.value = "";
  renderLinks();
}

function renderLinks() {
  savedUl.innerHTML = "";

  fragment = document.createDocumentFragment();

  links = storedLinks;
  links
    .slice()
    .reverse()
    .forEach((link) => {
      fragment.appendChild(newItem(link));
    });

  savedUl.appendChild(fragment);
}

function newItem(link) {
  let linkEl = document.createElement("a");
  linkEl.href = link.slice(0, 4) === "http" ? link : "https://" + link;
  linkEl.target = "_blank";
  linkEl.textContent = link;

  let delBtn = document.createElement("button");
  delBtn.className = "delete-item-btn";
  delBtn.textContent = "X";

  let itemEl = document.createElement("li");
  itemEl.appendChild(linkEl);
  itemEl.appendChild(delBtn);

  return itemEl;
}

document.getElementById("delete-all-btn").addEventListener("click", deleteAll);
function deleteAll() {
  links = [];
  localStorage.clear();
  savedUl.innerHTML = "";
}

document.addEventListener("click", function (event) {
  let delBtn = event.target.closest(".delete-item-btn");
  if (delBtn) {
    const url = delBtn.parentElement.children[0].textContent;
    const idx = links.indexOf(url);
    links.splice(idx, 1);
    storedLinks = links;
    localStorage.setItem("links", JSON.stringify(storedLinks));
    renderLinks();
  }
});
