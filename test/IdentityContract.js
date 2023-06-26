const IdentityContract = artifacts.require("IdentityContract");

contract("IdentityContract", () => {
  before(async () => {
    this.identityContract = await IdentityContract.deployed();
  });

  it("deploys successfully", async () => {
    const address = await this.identityContract.address;
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
  });

  it("get Identity List", async () => {
    const identityCount = await this.identityContract.identityCount();
    const identities = await this.identityContract.identities(identityCount);

    assert.equal(identities.id.toNumber(), identityCount);
    assert.equal(
      identities.img,
      "QmX4hQ4ETRodmPLqnVL8n3bgf5jtqrpmqb6QqbMUT9DxzE"
    );
    assert.equal(identities.firstName, "Javier Alejandro");
    assert.equal(identities.lastName, "Salazar Torres");
    assert.equal(identities.addresss, "Valle de Suchil #221");
    assert.equal(identities.birthDay, "2000-07-04");
    assert.equal(identities.personalId, "SATJ000704HDGLRVA4");
    assert.equal(identityCount, 1);
  });

  it("indenty created successfully", async () => {
    const result = await this.identityContract.createIdentity(
      "QmX4hQ4ETRodmPLqnVL8n3bgf5jtqrpmqb6QqbMUT9DxzE",
      "Eva Rcocío",
      "Salazar Castrellón",
      "Valle Florido #109",
      "2000-09-07",
      "SATJ000704HDGLRVA4"
    );
    const identieEvent = result.logs[0].args;
    const identityCount = await this.identityContract.identityCount();

    assert.equal(identityCount, 2);
    assert.equal(identieEvent.id.toNumber(), 2);
    assert.equal(
      identities.img,
      "QmX4hQ4ETRodmPLqnVL8n3bgf5jtqrpmqb6QqbMUT9DxzE"
    );
    assert.equal(identieEvent.firstName, "Eva Rcocío");
    assert.equal(identieEvent.lastName, "Salazar Castrellón");
    assert.equal(identieEvent.addresss, "Valle Florido #109");
    assert.equal(identieEvent.birthDay, "2000-09-07");
    assert.equal(identieEvent.personalId, "SATJ000704HDGLRVA4");
  });
});
