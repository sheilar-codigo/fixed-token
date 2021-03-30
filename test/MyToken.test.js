const Token = artifacts.require("MyToken")

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({path: "../.env"});

contract("Token Test", async (accounts) => {

	const [deployerAccount, recipientAccount, anotherAccount] = accounts;

	beforeEach(async() => {
		this.newToken = await Token.new(process.env.INITIAL_TOKENS);
	});

	it("all tokens should be in contract deployer account", async () => {
		let instance = this.newToken;
		let totalSupply = await instance.totalSupply();
		let balance = await instance.balanceOf(deployerAccount);
		return expect(Promise.resolve(balance)).to.eventually.be.a.bignumber.equal(totalSupply);
	});

	it("is possible to send tokens between accounts", async () => {
		const sendTokens = new BN(1);
		let instance = this.newToken;
		let totalSupply = await instance.totalSupply();
		let balanceOfDeployer = await instance.balanceOf(deployerAccount);
		
		return expect(Promise.resolve(balanceOfDeployer)).to.eventually.be.a.bignumber.equal(totalSupply);
		return expect(Promise.resolve(instance.transfer(recipientAccount, sendTokens))).to.eventually.be.fulfilled;
		return expect(Promise.resolve(instance.balanceOf(deployerAccount))).to.eventually.be.a.bignumber.equal(totalSupply.sub(sendTokens));
	});

	it("is not possible to send more tokens than available tokens", async () => {
		let instance = this.newToken;
		let balanceOfDeployer = await instance.balanceOf(deployerAccount);
		return expect(Promise.resolve(instance.transfer(recipientAccount, new BN(balanceOfDeployer + 1)))).to.eventually.be.rejected;
		return expect(Promise.resolve(instance.balanceOf(deployerAccount))).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
	});
});
