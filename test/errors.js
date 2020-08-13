const { promisify } = require("util");

const Reverter = artifacts.require("Reverter");

// async provider.send (uses web3 global)
const send = promisify(web3.currentProvider.send.bind(web3.currentProvider));

// submits without awaiting receipt; returns tx hash
const submit = async (operation) => new Promise(
  (accept, reject) => {
    operation.on("transactionHash", accept);
    setTimeout(reject, 5000);
  }
);


contract("Reverter", () => {
  it("might return both result and error", async () => {
    const from = (await web3.eth.getAccounts())[0];
    const to = (await Reverter.deployed()).address;

    // disable miner
    await send({
      method: "miner_stop",
      params: []
    });

    // first failure
    await send({
      method: "eth_sendTransaction",
      params: [{
        from, to,
        gas: "0x6691b7",
        gasPrice: "0x4a817c800",
        data: "0xc0406226"
      }]
    });

    // we'll debug the second
    const { result: txHash } = await send({
      method: "eth_sendTransaction",
      params: [{
        from, to,
        gas: "0x6691b7",
        gasPrice: "0x4a817c800",
        data: "0xc0406226"
      }]
    });

    // restart miner
    await send({
      method: "miner_start",
      params: [],
    });

    // issue debug
    const response = await send({
      method: "debug_traceTransaction",
      params: [txHash, {}]
    });

    assert.property(response, "result");
    assert.property(response, "error");
  });
});
