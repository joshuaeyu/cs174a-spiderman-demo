window.CoinCounter = window.classes.CoinCounter = 
class CoinCounter {
  constructor(numCoins) {
    this.count = 0;
    this.totalNum = numCoins;
    
    //insert coin counter into HTML
    let counterDiv = document.createElement("div");
    counterDiv.id = "coin-counter";
    let counterText = document.createTextNode(this.getMessage());
    counterDiv.appendChild(counterText);
    document.getElementById("main-canvas").appendChild(counterDiv);

    //save counter
    this.counterDisplay = counterDiv;
  }

  // decreases coin count by 1 unless count is already 0
  incrementCount() {
    this.count += 1;
    this.counterDisplay.innerHTML = this.getMessage();
  }

  getMessage() {
    return "Number of coins found: "+this.count;
  }
}