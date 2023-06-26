const ProjectContract = artifacts.require("ProjectContract");

contract("ProjectContract", () => {
  before(async () => {
    this.projectContract = await ProjectContract.deployed();
  });

  it("deploys successfully", async () => {
    const address = await this.projectContract.address;
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
  });

  it("get Project List", async () => {
    const projectCount = await this.projectContract.projectCount();
    const projects = await this.projectContract.projects(projectCount);

    assert.equal(projects.id.toNumber(), projectCount);
    assert.equal(projects.name, "Casa de Javier");
    assert.equal(
      projects.description,
      "Casa de 2 pisos con 3 recamaras y 2 banios"
    );
    assert.equal(projects.location, "Durango, Durango");
    assert.equal(projects.ownerId, "SATJ000704HDGLRVA4");
    assert.equal(projects.projectStatus, "Disponible");
    assert.equal(projectCount, 1);
  });

  it("project created successfully", async () => {
    const result = await this.projectContract.createProject(
      "Casa de Rocío",
      "Casa de 1 piso con 2 recamaras y 1 banio",
      "Durango, Durango",
      "SATJ000704HDGLRVA4",
      "Disponible"
    );
    const projectEvent = result.logs[0].args;
    const projectCount = await this.projectContract.projectCount();

    assert.equal(projectCount, 2);
    assert.equal(projectEvent.id.toNumber(), 2);
    assert.equal(projectEvent.name, "Casa de Rocío");
    assert.equal(
      projectEvent.description,
      "Casa de 1 piso con 2 recamaras y 1 banio"
    );
    assert.equal(projectEvent.location, "Durango, Durango");
    assert.equal(projectEvent.ownerId, "SATJ000704HDGLRVA4");
    assert.equal(projectEvent.projectStatus, "Disponible");
  });
});
