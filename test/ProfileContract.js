const ProfileContract = artifacts.require("ProfileContract");

contract("ProfileContract", () => {
  before(async () => {
    this.profileContract = await ProfileContract.deployed();
  });

  it("deploys successfully", async () => {
    const address = await this.profileContract.address;
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
  });

  it("get Profile List", async () => {
    const profileCount = await this.profileContract.profileCount();
    const profiles = await this.profileContract.profiles(profileCount);

    assert.equal(profiles.id.toNumber(), profileCount);
    assert.equal(
      profiles.img,
      "QmX4hQ4ETRodmPLqnVL8n3bgf5jtqrpmqb6QqbMUT9DxzE"
    );
    assert.equal(profiles.firstName, "Javier Alejandro");
    assert.equal(profiles.lastName, "Salazar Torres");
    assert.equal(profiles.birthDay, "2000-07-04");
    assert.equal(profiles.personalId, "SATJ000704HDGLRVA4");
    assert.equal(profileCount, 1);
  });

  it("indenty created successfully", async () => {
    const result = await this.profileContract.createProfile(
      "QmX4hQ4ETRodmPLqnVL8n3bgf5jtqrpmqb6QqbMUT9DxzE",
      "Eva Rcocío",
      "Salazar Castrellón",
      "2000-09-07",
      "SATJ000704HDGLRVA4"
    );
    const identieEvent = result.logs[0].args;
    const profileCount = await this.profileContract.profileCount();

    assert.equal(profileCount, 2);
    assert.equal(identieEvent.id.toNumber(), 2);
    assert.equal(
      profiles.img,
      "QmX4hQ4ETRodmPLqnVL8n3bgf5jtqrpmqb6QqbMUT9DxzE"
    );
    assert.equal(identieEvent.firstName, "Eva Rcocío");
    assert.equal(identieEvent.lastName, "Salazar Castrellón");
    assert.equal(identieEvent.birthDay, "2000-09-07");
    assert.equal(identieEvent.personalId, "SATJ000704HDGLRVA4");
  });
});
