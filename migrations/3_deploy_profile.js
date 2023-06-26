const ProfileContract = artifacts.require("ProfileContract");

module.exports = function (deployer) {
  deployer.deploy(ProfileContract);
};
