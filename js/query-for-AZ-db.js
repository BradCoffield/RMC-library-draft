//TODO: don't forget you pulled the link to this file from databases-AZ.html and just pasted it directly in for drupal reasons.

//oct 7 2020 - adding __ to place metadata in the head for filtering with isotope

let databasesRef = db.collection("databases");
let proxyRef = db.collection("proxyServerUrl");
let theProxyUrl = "";

// Because these are all uppercased only databases that's name field begins with uppercase are being shown.
let lettersINeed = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
];

let listA = document.getElementById("databases-A");

class AlphabeticalDatabase {
  constructor(letter, dbData) {
    this.letter = letter;
    this.dbData = dbData;
  }

  appendIt() {
    const contentTypesMap = this.dbData.content_types.map(
      (el) => `<li>${el}</li>`
    );

    let dbNode = document.getElementsByName(`${this.letter}${this.letter}`);
    //need to include element-item and the content types as classes so they work with isotope filtering. need to remove spaces from the content types. Also, need to remove illegal characters from the ct for classnames
    let contentTypesNoSpaces = this.dbData.content_types.map((ctt) => {
      //get rid of CSS unsafe characters
      let stepOne = ctt.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
     return stepOne.replace(/\s+/g, '');
    })
    dbNode[0].insertAdjacentHTML(
      "beforeend",
      ` <li class="database-li element-item ${contentTypesNoSpaces.join(" ")}">
        <h5><a href="${this.dbData.url}" target="_blank">${
        this.dbData.name
      }</a></h5>
        <p class="database-description">${this.dbData.description}</p>
        <ul class="database-list-resourcetype">
        ${contentTypesMap.join("")}
             <ul>
        </li>`
    );
  }
}
let rawContentTypes = [];
proxyRef
  .get()
  .then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      theProxyUrl = doc.data().proxyURL;
    });
  })
  .then(
    databasesRef.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        let name = doc.data().name;
        //  console.log(doc.data());
        //  console.log(name, doc.data().use_proxy);
        let content_types = doc.data().content_types;
         
        let description = doc.data().description;
        //need to check if use_proxy is true and if so append it to the db url
        let url = "";
        // console.log(doc.data().use_proxy, "useprzy");
        if (doc.data().use_proxy) {
          url = `${theProxyUrl}${doc.data().url}`;
        } else {
          url = doc.data().url;
        }
        // console.log(url);
        let dbObj = { name, content_types, description, url };
        lettersINeed.forEach(function (letter) {
          if (name.charAt(0) == letter) {
            let newThing = new AlphabeticalDatabase(letter, dbObj);
            newThing.appendIt();
          }
        });
        content_types.forEach(function (contentType) {
          rawContentTypes.push(contentType);
        });
      });
      console.log(rawContentTypes);
      const unique = (value, index, self) => {
        return self.indexOf(value) === index;
      };
      const dedupedcontenttypes = rawContentTypes.filter(unique);
      console.log(dedupedcontenttypes);
      CTAppend(dedupedcontenttypes.sort());
    })
  );

function CTAppend(ct) {
  ct.forEach((ctEH) => {
    let noBadCharacters = ctEH.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
    let withoutSpaces = noBadCharacters.replace(/\s+/g, '');
    console.log(ctEH, withoutSpaces);
     
    let dbNode = document.getElementById("content-type-filters");
    dbNode.insertAdjacentHTML(
      "beforeend",
      `
      <button class="button" data-filter=".${withoutSpaces}">
      ${ctEH}
    </button>
      `
    );
  });
    // init Isotope
    var iso = new Isotope(".for-filtering", {
      itemSelector: ".element-item",
      layoutMode: "vertical",
    });
    
    // filter functions
    var filterFns = {};
    
    // bind filter button click
    var filtersElem = document.querySelector(".filters-button-group");
    filtersElem.addEventListener("click", function (event) {
      // only work with buttons
      if (!matchesSelector(event.target, "button")) {
        console.log("ohhhhh");
        return;
      }
      var filterValue = event.target.getAttribute("data-filter");
      // use matching filter function
      filterValue = filterFns[filterValue] || filterValue;
      iso.arrange({ filter: filterValue });
    });
    
    // change is-checked class on buttons
    var buttonGroups = document.querySelectorAll(".filters-button-group");
    for (var i = 0, len = buttonGroups.length; i < len; i++) {
      var buttonGroup = buttonGroups[i];
      console.log("ehhhh", buttonGroup);
      radioButtonGroup(buttonGroup);
    }
    
    function radioButtonGroup(buttonGroup) {
      buttonGroup.addEventListener("click", function (event) {
        // only work with buttons
        console.log("hi");
        if (!matchesSelector(event.target, "button")) {
          return;
        }
        buttonGroup.querySelector(".is-checked").classList.remove("is-checked");
        event.target.classList.add("is-checked");
      });
    }
}
