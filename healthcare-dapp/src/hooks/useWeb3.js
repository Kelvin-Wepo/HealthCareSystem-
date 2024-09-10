// src/hooks/useWeb3.js

import { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractABI from '../abi/HealthcareSystem.json'; // Replace with the actual ABI JSON file

const useWeb3 = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);

  const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract's deployed address

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWeb3(web3Instance);

          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          const myContract = new web3Instance.eth.Contract(contractABI, contractAddress);
          setContract(myContract);
        } catch (error) {
          console.error('Error initializing web3:', error);
        }
      } else {
        console.error('Please install MetaMask!');
      }
    };

    initWeb3();
  }, []);

  return { web3, account, contract };
};

export default useWeb3;

