console.log("hihihi");
let libraryFeaturedCollections = (function() {
  let featuredCollectionsRef = db.collection("featured-collections");

  class FeaturedCollection {
    constructor(theStuff) {
      this.theStuff = theStuff;
    }

    appendIt() {
      let aa = document.getElementById("featured-collections-cards-wrap");
      aa.insertAdjacentHTML("beforeend", this.theStuff);
    }
  }

  featuredCollectionsRef.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      console.log(doc.data());

      let theStuff = `<a href="${doc.data().url}">
                <div class="col-lg-4 ">
                <div class="card">
                    <img src="${doc.data().image}" alt="${doc.data().imageAlt}">
                    <h4>${doc.data().name}</h4>
                    <p style="font-size: 16px">${doc.data().description}</p>
                    <a href="${doc.data().url}" class="blue-button">${
        doc.data().buttonLabel
      }</a>
                </div>
            </div>
        </a>`;
      let ttttt = new FeaturedCollection(theStuff);
      let aab = document.getElementById("featured-collections-preloader")
      aab.style.display = "none";
      ttttt.appendIt();
    });
  });
})();
