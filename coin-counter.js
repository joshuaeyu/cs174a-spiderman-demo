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
    if (this.count >= this.totalNum) return;
    this.count += 1;
    this.counterDisplay.innerHTML = this.getMessage();

    if (this.count == this.totalNum) {
      this.showWinningMessage();
    }
  }

  getMessage() {
    return "Number of coins found: "+this.count+"/"+this.totalNum;
  }

  showWinningMessage() {
     //insert winning message into HTML
    let winningMsg = document.createElement("div");
    winningMsg.id = "winning-msg";
    let winningText1 = document.createTextNode("You won!");
    winningMsg.appendChild(winningText1);
    let br = document.createElement("br");
    winningMsg.appendChild(br);
    let winningText2 = document.createTextNode("Congratulations!");
    winningMsg.appendChild(winningText2);
    document.getElementById("main-canvas").appendChild(winningMsg);
  }
}