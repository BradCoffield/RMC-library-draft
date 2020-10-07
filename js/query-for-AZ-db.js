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
    dbNode[0].insertAdjacentHTML(
      "beforeend",
      ` <li class="database-li">
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
     CTAppend(dedupedcontenttypes.sort())
    })
  );

  function CTAppend(ct) {
    ct.forEach(ctEH => {
       let dbNode = document.getElementById("content-type-filters");
      dbNode.insertAdjacentHTML("beforeend", `<li style="display:inline;margin:5px;">${ctEH}</li>`);
    })
  }

 