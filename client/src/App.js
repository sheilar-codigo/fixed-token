import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";
import "./App.css";

class App extends Component {
  state = { loaded: false, kycAddress: "", tokenSaleAddress: "", userTokens: 0, buyTokens: 0, isWhiteListed: "", totalSupply: 0};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      
      this.tokenInstance = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
      );

      this.tokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
      );

      this.kycInstance = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
      );

      this.setState({loaded: true, tokenSaleAddress: MyTokenSale.networks[this.networkId].address}, this.updateUserTokens);
      this.checkKycWhitelisting();
      this.updateTotalSupply();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type == "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleTokenInputChange = (event) => {
    const target = event.target;
    const value = target.type == "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleKycWhitelisting = async() => {
    await this.kycInstance.methods.setKycCompleted(this.state.kycAddress).send({from: this.accounts[0]});
    alert("KYC for "+ this.state.kycAddress + " is completed.")
  }

  checkKycWhitelisting = async() => {
    let isListed = await this.kycInstance.methods.isKycCompleted(this.accounts[0]).call();
    console.log("isListed: ", isListed);
    this.setState({isWhiteListed: isListed ? "Yes" : "No"});
  }

  handleBuyTokens = async() => {
    console.log("Token: " + this.state.buyTokens);
    console.log("Token Sale Address: " + this.state.tokenSaleAddress);
    await this.tokenSaleInstance.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], to: this.state.tokenSaleAddress, value: this.state.buyTokens});
    alert("Purchased successfully!")
    this.updateUserTokens();
  }

  updateUserTokens =  async()  => {
    let userTokens = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call({from: this.accounts[0]});
    console.log("userTokens: " + userTokens);
    this.setState({userTokens: userTokens});
  }

  updateTotalSupply = async() => {
    let totalSupply = await this.tokenInstance.methods.totalSupply().call({from: this.accounts[0]});
    console.log("totalSupply: " + totalSupply);
    this.setState({totalSupply: totalSupply});
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="App">
        <h1>StarsDucts Cappucino Token</h1>
        <p>Get your CAPPU tokens today!</p>
        <h1> Allow Address </h1>
        <p> KYC provided: <b> {this.state.isWhiteListed} </b> </p>
        Address to allow KYC: <input type = "text" name = "kycAddress" value = {this.state.kycAddress} onChange={this.handleInputChange}/>
        <button type = "button" onClick={this.handleKycWhitelisting}>Add to Whitelist</button>
        
        <h1> Total Supply: {this.state.totalSupply} </h1>
        <p> You currently have: {this.state.userTokens} </p>  
        <h1> Buy Tokens </h1>
        Enter Token Amount: <input type = "text" name = "buyTokens" value = {this.state.buyTokens} onChange={this.handleTokenInputChange}/>
        <button type = "button" onClick={this.handleBuyTokens}>Buy tokens</button>
        <h1> Buy from wallet </h1> 
        <p> If you want to buy tokens, send ETH to this CrowdSale Addresss: {this.state.tokenSaleAddress} </p>
      </div>
    );
  }
}

export default App;
