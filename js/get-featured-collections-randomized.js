let libraryFeaturedCollections = (function() {
  let featuredCollectionsRef = db.collection("featured-collections");
  let theCollections = [];

  const getRandomNumbers = function(howMany, upperLimit) {
    var limit = howMany,
      amount = 1,
      lower_bound = 0,
      upper_bound = upperLimit,
      unique_random_numbers = [];
    if (amount > limit) limit = amount; //Infinite loop if you want more unique natural numbers than exist in a given range
    while (unique_random_numbers.length < limit) {
      var random_number = Math.floor(
        Math.random() * (upper_bound - lower_bound) + lower_bound
      );
      if (unique_random_numbers.indexOf(random_number) == -1) {
        unique_random_numbers.push(random_number);
      }
    }
    return unique_random_numbers;
  };

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
      theCollections.push(doc.data());
    });
     let ourRandoms = getRandomNumbers(3, theCollections.length);
     ourRandoms.forEach((i) => {
       doAppending(theCollections[i])
     })
 
  });

  let doAppending = function(data) {
    let theStuff = `<a href="${data.url}">
                <div class="col-lg-4 ">
                <div class="card">
                    <img src="${data.image}" alt="${data.imageAlt}">
                    <h4>${data.name}</h4>
                    <p style="font-size: 16px">${data.description}</p>
                    <a href="${data.url}" class="blue-button">${data.buttonLabel}</a>
                </div>
            </div>
        </a>`;
    let ttttt = new FeaturedCollection(theStuff);
    let aab = document.getElementById("featured-collections-preloader");
    aab.style.display = "none";
    ttttt.appendIt();
  };
})();
