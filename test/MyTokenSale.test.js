const TokenSale = artifacts.require("MyTokenSale")
const Token = artifacts.require("MyToken")
const KycContract = artifacts.require("KycContract")

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({path: "../.env"});

contract("MyTokenSale Test", async (accounts) => {

	const [deployerAccount, recipientAccount] = accounts;

	it("should not have tokens in deployer account", async () => {
		let instance = await Token.deployed();
		return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
	});

	it("all tokens should be in the TokenSale Smart Contract by default", async () => {
		let instance = await Token.deployed();
		let balanceOfSmartContract = await instance.balanceOf(TokenSale.address);
		let totalSupply = await instance.totalSupply();
		expect(Promise.resolve(balanceOfSmartContract)).to.eventually.be.a.bignumber.equal(totalSupply);
	});

	it("should be able to buy tokens from TokenSale Smart Contract", async () => {
		let tokenInstance = await Token.deployed();
		let tokenSaleInstance = await TokenSale.deployed();
		let kycInstance = await KycContract.deployed();
		let balanceBefore = await tokenInstance.balanceOf(deployerAccount);

		return kycInstance.setKycCompleted(deployerAccount, {from: deployerAccount});

		return expect(Promise.resolve(tokenSaleInstance.sendTransaction({from: deployerAccount, value: web3.utils.toWei("1", "wei")}))).to.eventually.be.fulfilled;
		return expect(Promise.resolve(tokenInstance.balanceOf(deployerAccount))).to.be.a.bignumber.equal(balanceBefore.add(new BN(1)));
	});
});