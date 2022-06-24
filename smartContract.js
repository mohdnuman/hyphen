const Web3 = require("web3");
const prompt = require("prompt-sync")();

const Abi = require("./abi.json");

let web3;

const provider = new Web3.providers.HttpProvider(
  "https://mainnet.infura.io/v3/287af69fca9142f3b1681a93ce4c3afa"
);
web3 = new Web3(provider);

async function getBalance(address) {
  const contract = "0xc49B65e5a350292Afda1f239eBefE562668717c2";
  const instance = new web3.eth.Contract(Abi, contract);


  const contract2 = "0xebaB24F13de55789eC1F3fFe99A285754e15F7b9";
  const instance2 = new web3.eth.Contract(Abi, contract2);

  let positions = await instance.methods.getAllNftIdsByUser(address).call();

  for (let i = 0; i < positions.length; i++) {
    let balance = await instance.methods.tokenMetadata(positions[i]).call();

    let decimals,symbol;
    let tokenAddress = balance.token;
    if (tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
      symbol = "ETH";
      decimals = 18;
    } else {
      const tokenInstance = new web3.eth.Contract(Abi, tokenAddress);
      symbol = await tokenInstance.methods.symbol().call();
      decimals = await tokenInstance.methods.decimals().call();
    }

    let rewards=await instance2.methods.getFeeAccumulatedOnNft(positions[i]).call();

    console.log(
      (balance.suppliedLiquidity / 10 ** decimals).toFixed(2),
      symbol
    );
    console.log('rewards:',(rewards/10**decimals).toFixed(2),symbol)

  }
}

async function getBalance2(address) {
  const contract = "0x781f4EfC37a08C0ea6631204E46B206330c8c161";
  const instance = new web3.eth.Contract(Abi, contract);

  const contract2 = "0xc49B65e5a350292Afda1f239eBefE562668717c2";
  const instance2 = new web3.eth.Contract(Abi, contract2);

  let positions = await instance.methods.getNftIdsStaked(address).call();

  for (let i = 0; i < positions.length; i++) {
    let balance = await instance2.methods.tokenMetadata(positions[i]).call();
    let rewards = await instance.methods.pendingToken(positions[i]).call();

    let decimals,symbol;
    let tokenAddress = balance.token;
    if (tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
      symbol = "ETH";
      decimals = 18;
    } else {
      const tokenInstance = new web3.eth.Contract(Abi, tokenAddress);
      symbol = await tokenInstance.methods.symbol().call();
      decimals = await tokenInstance.methods.decimals().call();
    }

    console.log(
      (balance.suppliedLiquidity / 10 ** decimals).toFixed(2),
      symbol
    );
    console.log((rewards / 10 ** 18).toFixed(2), "BICO");
  }
}

const userAddr = prompt("User Address-");
getBalance(userAddr);
getBalance2(userAddr);
