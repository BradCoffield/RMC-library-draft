console.log("hi");

const newBooksFirestoreWrap = (function () {
  const newBooksFirestore = function (howManyWeWant) {
    let totalDisplayed = 0;

    function checkThisBook(num) {
      //   console.log("sup",num);
      let selectah = document.getElementById(`cover${num}`);
      let selectah2 = document.getElementById(`new-books-li-${num}`);
      if (selectah.naturalWidth < 50) {
        //   console.log("bad!", `cover${num}`);
        selectah2.style.display = "none";
      }
      if (selectah.naturalWidth > 50) {
        //   console.log("good!!", `cover${num}`);
        totalDisplayed++;
      }
    }

    fetch(
      "https://rmc-proxy-server.herokuapp.com/api/rmc-library-data/collection/primo-book-searches"
    )
      .then((resp) => resp.json())

      .then(function (result) {
        // console.log(result);

        result.forEach((item) => {
          let ob = Object.keys(item);
          if (ob[0] == "new-books") {
            // console.log(item["new-books"].results);

            const rawData = item["new-books"].results;

            const getRandomNumbers = function (howMany, upperLimit) {
              var limit = howMany,
                amount = 1,
                lower_bound = 1,
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

            var ourRandoms = getRandomNumbers(50, 100);
            doThings(rawData, ourRandoms);
          }
        });
      }).catch((error) => {
        // For some reason, nearly every fresh page load something fails such that the ISBN is undefined. This catches the error and re-runs everything. Failsafes below so that we can only re-run a few times.
        console.log("ERROR!",error);
        runThestuff()
      });

    function doThings(results, randoms) {
      let baseDom = document.getElementById("new-books-1");
      baseDom.insertAdjacentHTML("beforeend", "<ul id='new-books'></ul>");
      let nextDom = document.getElementById("new-books");
      nextDom.style.display = "none";
      let i = 0;
      for (i; totalDisplayed < howManyWeWant; i++) {
        // console.log(results.rawData[results.ourRandoms[i]].pnx.search);
        // console.log(results[randoms[i]]);
        let theIsbn = results[randoms[i]].isbn[0];
        let theTitle = results[randoms[i]].title;
        let theCatalogLink = `<a href="https://rocky-primo.hosted.exlibrisgroup.com/permalink/f/1j18u99/${
          results[randoms[i]].sourceid[0]
        }${results[randoms[i]].sourcerecordid[0]}"
          target="_blank">`;

        let syndetics = `https://syndetics.com/index.aspx?isbn=${theIsbn}/MC.JPG&client=primo`;

        addToDom(syndetics, theTitle, theCatalogLink, i);
      }
      // let nextDom = document.getElementById("new-books");
      let preloader = document.getElementById("library-preloader");
      preloader.style.display = "none";
      nextDom.style.display = "block";
    }

    function addToDom(theIMG, theTitle, catalogLink, i) {
      if (totalDisplayed < howManyWeWant) {
        class RmcNewBooks {
          constructor(theBookStuff) {
            this.theBookStuff = theBookStuff;
          }
          getToAppending() {
            var domsn = document.getElementById("new-books");
            domsn.insertAdjacentHTML("beforeend", this.theBookStuff);
            checkThisBook(i);

            //   totalDisplayed++;
          }
        }

        var theBookStuff = `
               <li class="new-books-li" id="new-books-li-${i}">
                 <div class="content">
                  
                     ${catalogLink}
                         <div class="content-overlay"></div>
                         <img class="content-image book-cover" id="cover${i}" src="${theIMG}"  >
                         <div class="content-details fadeIn-bottom">
                             <div class="content-title">${theTitle}
                              
                     
                         </div>
                     </a>
                 </div>
             </li>`;

        var ttttt = new RmcNewBooks(theBookStuff);
        ttttt.getToAppending();
      }
    }
  };
  function runThestuff() {
    newBooksFirestore(6);
    let nextDom = document.getElementById("new-books");
    nextDom.remove();
    totalstuffRuns++;
  }
  let maxstuffRuns = 10;
  let totalstuffRuns = 0;
  if (totalstuffRuns < maxstuffRuns) {
    console.log("New books attempts:", totalstuffRuns+=1);
    runThestuff();
  }
})();
