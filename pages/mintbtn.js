import React, { useState, useEffect } from "react";
import abi from "./abi.json";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

const REACT_APP_CONTRACT_ADDRESS = "0x26e09dBA778E98f83C4915DD724F651F83A740D7";
const SELECTEDNETWORK = "4";
const SELECTEDNETWORKNAME = "Ethereum Mainnet";
const nftquantity = 500;

function Mintbtn() {
  const [errormsg, setErrorMsg] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [walletConnected, setWalletConnected] = useState(0);
  const [userAddress, setUserAddress] = useState("");

  useEffect(async () => {
    if (await detectEthereumProvider()) {
      window.web3 = new Web3(window.ethereum);
      const web3 = window.web3;
      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        const contractaddress = REACT_APP_CONTRACT_ADDRESS;
        const ct = new web3.eth.Contract(abi, contractaddress);

        if (nftquantity - (await ct.methods.totalSupply().call()) == 0) {
          setErrorMsg("All NFTs minted, Sale has ended");
        }
      } else {
        setErrorMsg(
          'Select "' +
            SELECTEDNETWORKNAME +
            '" network in your wallet to buy the nft'
        );
      }
    } else {
      setErrorMsg(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
    if (window.ethereum) {
      handleEthereum();
    } else {
      window.addEventListener("ethereum#initialized", handleEthereum, {
        once: true,
      });
      setTimeout(handleEthereum, 10000);
    }

    function handleEthereum() {
      const { ethereum } = window;
      if (ethereum && ethereum.isMetaMask) {
        console.log("Ethereum successfully detected!");
        // setProvider(true);
      } else {
        setErrorMsg("Please install MetaMask!");
        // setProvider(false);
      }
    }
  }, []);

  async function loadWeb3() {
    if (await detectEthereumProvider()) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const web3 = window.web3;

      // Meta Mask Connected Account Address
      let metaMaskAccount = await web3.eth.getAccounts();
      metaMaskAccount = metaMaskAccount[0];

      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        // // creating contract instance
        const contractaddress = REACT_APP_CONTRACT_ADDRESS;
        const ct = new web3.eth.Contract(abi, contractaddress);
        let current = await ct.methods.totalSupply().call();
        if (Number(current) === nftquantity) {
          console.log("Sold out");
          return;
        }

        let price = await ct.methods.getPrice().call();

        await ct.methods.mint(quantity).send({
          from: metaMaskAccount,
          value: price * quantity,
        });
        setQuantity(1);
      } else {
        setErrorMsg(
          'Select "' +
            SELECTEDNETWORKNAME +
            '" network in your wallet to buy the nft'
        );
      }
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      {
        setErrorMsg(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    }
  }

  async function connectWallet() {
    if (await detectEthereumProvider()) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const web3 = window.web3;

      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        // // creating contract instance
        const contractaddress = REACT_APP_CONTRACT_ADDRESS;
        const ct = new web3.eth.Contract(abi, contractaddress);

        let metaMaskAccount = await web3.eth.getAccounts();
        metaMaskAccount = metaMaskAccount[0];

        metaMaskAccount =
          metaMaskAccount.substring(0, 15) +
          "........" +
          metaMaskAccount.substring(
            metaMaskAccount.length - 10,
            metaMaskAccount.length
          );

        setUserAddress(metaMaskAccount);
        setWalletConnected(1);
      }
    }
  }

  return (
    <div className="BtnDiv">
      <h6 className="text-center">{userAddress}</h6>
      {!errormsg ? (
        <div className="row justify-center py-3 flex">
          {walletConnected == 0 ? (
            <button
              className="transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center w-full px-4 py-3 my-2 text-xs text-blueGray-500 font-semibold leading-none border border-gray-200 hover:bg-blueGray-50 rounded"
              onClick={() => {
                connectWallet();
              }}
            >
              <span className="pr-10">Sign In with</span>
              <img className="h-6" src="/assets/imgs/logos/mm-logo.svg" />
            </button>
          ) : (
            ""
          )}
          {walletConnected == 1 ? (
            <>
              <div className="col-sm-5">
                <div className="d-flex justify-content-center text-center">
                  <button
                    className="inline-block py-2 px-4 mx-5 text-xs font-semibold bg-blue-500 text-white rounded"
                    onClick={() => setQuantity(quantity - 1)}
                    disabled={quantity == 1}
                  >
                    {" "}
                    -{" "}
                  </button>
                  <span class="inline-block py-2 px-4 mx-5 text-xs font-semibold rounded">
                    {quantity}
                  </span>
                  <button
                    className="inline-block py-2 px-4 mx-5 text-xs font-semibold bg-blue-500 text-white rounded"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity == 10}
                  >
                    {" "}
                    +{" "}
                  </button>
                </div>
              </div>
              <div className="col-sm-7 px-4 text-center">
                <button
                  type="button"
                  className="inline-block py-2 px-4 mx-5 text-xs font-semibold bg-blue-500 text-white rounded hover-up-2"
                  onClick={() => loadWeb3()}
                >
                  Mint
                </button>
              </div>
            </>
          ) : (
            ""
          )}
          {walletConnected == 2 ? (
            <h6 className="text-center text-white teamname w-100">
              Sale Ended
            </h6>
          ) : (
            ""
          )}
          {/* <p className="mt-3 text-white mx-auto mb-0 text-center">{nftquantity-totalSupply}/{nftquantity} Available</p> */}
        </div>
      ) : (
        <h5 className="mt-2 supplytext text-center">
          <b>{errormsg}</b>
        </h5>
      )}
    </div>
  );
}

export default Mintbtn;
