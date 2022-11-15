const { Console, Random } = require("@woowacourse/mission-utils/");
const Lotto = require("../src/Lotto");
const Calculator = require("../src/Calculator");
const Printer = require("./Printer");

class App {
  payMoney;
  winNumbers;
  bonusNumber;
  lottos;
  reward;
  revenue;
  printer;
  calculator;

  constructor() {
    this.payMoney = 0;
    this.winNumbers = [];

    this.bonusNumber = 0;

    this.lottos = [];

    this.rewards = [
      [3, 5_000, 0],
      [4, 50_000, 0],
      [5, 1_500_000, 0],
      [5.5, 30_000_000, 0],
      [6, 2_000_000_000, 0],
    ];
    this.revenue = 0;
    this.printer = new Printer();
    this.calculator = new Calculator();
  }

  play() {
    this.getInputMoney();
  }

  getInputMoney() {
    Console.readLine("구매금액을 입력해 주세요.\n", (input) => {
      if (!this.isValidMoney(input)) {
        throw "[ERROR]";
      }
      this.payMoney = input;
      this.printMoney();
      this.lottos = this.publishLottos(input / 1000);
      this.printLottosNumbers();
      this.getWinNumbers();
    });
  }

  isValidMoney(input) {
    if (input === "") return false;
    if (/[\D]/.test(input)) return false;
    if (input % 1000 != 0) return false;
    return true;
  }

  printMoney() {
    Console.print(`\n${this.payMoney / 1000}개를 구매했습니다.`);
  }

  publishLottos(count) {
    return new Array(count)
      .fill(undefined)
      .map((e) => new Lotto(Random.pickUniqueNumbersInRange(1, 45, 6)));
  }

  printLottosNumbers() {
    this.lottos.forEach((lotto) => {
      Console.print(`[${lotto.getNumbers().join(", ")}]`);
    });
  }

  getWinNumbers() {
    Console.readLine("\n당첨 번호를 입력해 주세요.\n", (input) => {
      if (!this.isValidWinNumbers(input)) {
        throw "[ERROR]";
      }
      this.winNumbers = input.split(",").map(Number);
      this.getBonusNumber();
    });
  }

  isValidWinNumbers(input) {
    let numbers = input.split(",").map(Number);
    if (new Set(numbers).size != 6) return false;
    if (numbers.includes(NaN)) return false;
    if (numbers.filter((e) => e < 1 || e > 45).length != 0) return false;
    else return true;
  }

  getBonusNumber() {
    Console.readLine("\n보너스 번호를 입력해 주세요.\n", (input) => {
      if (!this.isValidBonusNumber(input)) {
        throw "[ERROR]";
      } else {
        this.bonusNumber = input;
        this.matchLottos(this.lottos, this.winNumbers, this.bonusNumber);
        this.printer.printscore(this.rewards);
        this.revenue = calculator.conductRevenue(this.rewards, this.payMoney);
        this.printer.printRevenue(this.revenue);
        this.gameOver();
      }
    });
  }

  isValidBonusNumber(input) {
    return Number(input) >= 1 && Number(input) <= 45;
  }

  matchLottos(lottos, winNumbers, bonusNumber) {
    lottos
      .filter((lotto) => lotto.compareNumbers(winNumbers, bonusNumber) >= 3)
      .map((lotto) => lotto.compareNumbers(winNumbers, bonusNumber))
      .forEach((score) => {
        this.rewards.forEach((reward) => {
          if (score == reward[0]) reward[2] += 1;
        });
      });
  }
  gameOver() {
    Console.close();
  }
}

module.exports = App;
