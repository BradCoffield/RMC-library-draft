var fun = function() {
    console.log("eyyy");
    return false;
  };
 
const databaseClickTracker = (function() {
  console.log("hi");
 
db.collection("databases-tracking").doc("AAAS Science")
  .set({date:"today", clicks: 1}, { merge: true });
 
  })();

