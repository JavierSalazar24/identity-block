const IdentityContract = artifacts.require("IdentityContract");

module.exports = function (deployer) {
  deployer.deploy(IdentityContract);
};
