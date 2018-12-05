let databasesRef = db.collection("databases");

/* 
OKAY
So, I can't query the firestore database such that it only returns things that start with a certain letter. Only way to do that would be to have a field like 'starts_with': 'a' but that seems ridiculous.

So, it seems I'll need to query the whole collection, which seems fine to do.

Maybe loop over the array and get the charAt[0] and use that as the variable and push it onto an array by that name. Then I'll have like 22 arrays, each with things starting with whatever.

Will need to see if things stay in alpha order at this point or if I'll need to sort them in the array at the end.

Then I can get to appending. I tested that the other day and it worked.
*/

let lettersINeed = ["A", "B", "C","D","E","F","G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W"];

let listA = document.getElementById("databases-A");

class AlphabeticalDatabase {
  constructor(letter, dbData) {
    this.letter = letter;
    this.dbData = dbData;
  }
  
  appendIt() {
      
     
    const contentTypesMap = this.dbData.content_types.map(el => `<li>${el}</li>`);
 
 

    let dbNode = document.getElementsByName(`${this.letter}${this.letter}`);
    dbNode[0].insertAdjacentHTML(
      "beforeend",
      ` <li class="database-li">
        <h5><a href="${this.dbData.url}">${this.dbData.name}</a></h5>
        <p class="database-description">${this.dbData.description}</p>
        <ul class="database-list-resourcetype">
        ${contentTypesMap.join("")}
             <ul>
        </li>`
    );
  }
}


databasesRef.get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    let name = doc.data().name;
    console.log(name);
    let content_types = doc.data().content_types;
    let description = doc.data().description;
    let url = doc.data().url;
    let dbObj = { name, content_types, description, url };
// MAYBE WHAT I NEED TO DO IN ORDER TO SORT IS THE BELOW FOR EACH CREATES AN ARRAY AND THEN IT'S SORTED AND THEN USE THAT ARRAY TO BUILD THE OBJECT
//.....or i could change it from after end to before end....
    lettersINeed.forEach(function(letter) {
      if (name.charAt(0) == letter) {
        let newThing = new AlphabeticalDatabase(letter, dbObj);
        newThing.appendIt();
      }
    });
  });
});

 