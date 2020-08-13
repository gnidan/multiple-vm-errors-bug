const Reverter = artifacts.require("Reverter");

module.exports = function (deployer) {
  deployer.deploy(Reverter);
};
