const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("./server.js");
const { deserialize } = require("mongodb");

chai.use(chaiHttp);

const { expect } = chai;

describe("Server Routes", () => {
  describe("REQUESTS GET", () => {
    it("should return an array of sign up requests", (done) => {
      chai
        .request(app)
        .get("/requests")
        .end((err, res) => {
          expect(res).to.be.an("object");
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe("USERS GET", () => {
    it("should return an array of all the users", (done) => {
      chai
        .request(app)
        .get("/users")
        .end((err, res) => {
          expect(res).to.be.an("object");
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe("JOIN GROUP REQUESTS GET", () => {
    it("should return an array of all the join group requests", (done) => {
      chai
        .request(app)
        .get("/join-group-reqs")
        .end((err, res) => {
          expect(res).to.be.an("object");
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe("GROUPS GET", () => {
    it("should return an array of all the existing groups", (done) => {
      chai
        .request(app)
        .get("/groups")
        .end((err, res) => {
          expect(res).to.be.an("object");
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe("LOG IN POST", () => {
    it("should return false for incorrect input fields", (done) => {
      const requestData = { username: "mockuser", password: `wrongkey` };

      chai
        .request(app)
        .post("/login")
        .send(requestData)
        .end((err, res) => {
          expect(res.body).to.have.property("valid", false);
        });
      done();
    });

    it("should return true and the user object on correct details", (done) => {
      const requestData = { username: "super", password: `123` };

      chai
        .request(app)
        .post("/login")
        .send(requestData)
        .end((err, res) => {
          expect(res.body).to.have.property("valid", true);
          expect(res.body).to.have.property("user");
        });
      done();
    });
  });

  describe("CREATE GROUP POST", () => {
    it("should return fail if group name already exists", (done) => {
      const requestData = { name: "Fitness", userId: 1 };

      chai
        .request(app)
        .post("/create-group")
        .send(requestData)
        .end((err, res) => {
          expect(res.body).to.have.property("status", "fail");
        });
      done();
    });

    it("should return OK if group succesfully created", (done) => {
      const requestData = { name: "New Group", userId: 1 };

      chai
        .request(app)
        .post("/create-group")
        .send(requestData)
        .end((err, res) => {
          expect(res.body).to.have.property("status", "OK");
        });
      done();
    });
  });

  describe("REMOVE USER POST", () => {
    it("should return ok and the removed user", (done) => {
      const requestData = { userId: 1, groupId: 1 };

      chai
        .request(app)
        .post("/remove-user")
        .send(requestData)
        .end((err, res) => {
          expect(res.body).to.have.property("status", "ok");
          expect(res.body).to.have.property("user");
        });
      done();
    });
  });

  describe("DELETE USER POST", () => {
    it("should return ok and the removed user", (done) => {
      const requestData = { id: 3 };

      chai
        .request(app)
        .post("/delete-user")
        .send(requestData)
        .end((err, res) => {
          expect(res.body).to.have.property("status", "ok");
        });
      done();
    });
  });

  describe("JOIN GROUP POST", () => {
    it("should return status as request sent", (done) => {
      const requestData = {
        userId: 1,
        groupId: 1,
        groupName: "Meditation",
        userName: "john",
      };

      chai
        .request(app)
        .post("/join-group")
        .send(requestData)
        .end((err, res) => {
          expect(res.body).to.have.property("status", "request sent");
        });
      done();
    });
  });

  describe("MODIFY REQUEST POST", () => {
    it("should return status as added when approved by admin", (done) => {
      const requestData = {
        type: "approve",
        user: {
          email: "jacky@j.com",
          username: "jack",
          password: "123",
        },
      };

      chai
        .request(app)
        .post("/modify-request")
        .send(requestData)
        .end((err, res) => {
          expect(res.body).to.have.property("status", "added");
        });
      done();
    });

    it("should return status as denied when rejected by admin", (done) => {
      const requestData = {
        type: "approve",
        user: {
          email: "jacky@j.com",
          username: "jack",
          password: "123",
        },
      };

      chai
        .request(app)
        .post("/modify-request")
        .send(requestData)
        .end((err, res) => {
          expect(res.body).to.have.property("status", "denied");
        });
      done();
    });
  });

  describe("MODIFY GROUP REQUEST POST", () => {
    it("should return status progress in either cases of approve and reject", (done) => {
      const requestData = {
        type: "approve",
        request: {
          userId: 2,
          groupId: 3,
        },
      };

      chai
        .request(app)
        .post("/modify-group-request")
        .send(requestData)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res.body).to.have.property("status", "progress");
            done();
          }
        });
    });
  });

  describe("SIGN UP POST", () => {
    it("should indicate if username is already taken", (done) => {
      const requestData = {
        email: "z@z.com",
        username: "super",
        username: "req test pass",
      };

      chai
        .request(app)
        .post("/sign-up")
        .send(requestData)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res.body).to.have.property("status", "request sent");
            done();
          }
        });
    });

    it("should indicate if request was succesfull", (done) => {
      const requestData = {
        email: "z@z.com",
        username: "Req test user",
        username: "req test pass",
      };

      chai
        .request(app)
        .post("/sign-up")
        .send(requestData)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res.body).to.have.property("status", "fail");
            expect(res.body).to.have.property(
              "message",
              "username already taken"
            );
            done();
          }
        });
    });
  });
});
