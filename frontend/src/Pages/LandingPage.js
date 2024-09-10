// src/Pages/LandingPage.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

// Import ABI and contract address
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants';

const LandingPage = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [balance, setBalance] = useState('0');

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [isDoctor, setIsDoctor] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          setContract(contractInstance);

          // Fetch user profile
          try {
            const profile = await contractInstance.getUserProfile(address);
            setUserProfile(profile);
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }

          // Fetch token balance
          const balanceWei = await contractInstance.balanceOf(address);
          setBalance(ethers.formatEther(balanceWei));
        } catch (error) {
          console.error("Error initializing:", error);
        }
      }
    };

    init();
  }, []);

  const handleRegister = async () => {
    try {
      const tx = await contract.registerUser(name, age, gender, isDoctor);
      await tx.wait();
      alert("Registration successful!");
    } catch (error) {
      console.error("Error registering:", error);
      alert("Registration failed. See console for details.");
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">Welcome to Healthcare Token System</h1>
        
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connected Account</AlertTitle>
          <AlertDescription>{account}</AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-700">User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {userProfile ? (
                <div className="space-y-2">
                  <p><strong className="text-blue-600">Name:</strong> {userProfile.name}</p>
                  <p><strong className="text-blue-600">Age:</strong> {userProfile.age.toString()}</p>
                  <p><strong className="text-blue-600">Gender:</strong> {userProfile.gender}</p>
                  <p><strong className="text-blue-600">Is Doctor:</strong> {userProfile.isDoctor ? 'Yes' : 'No'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-blue-600">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="age" className="text-blue-600">Age</Label>
                    <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="gender" className="text-blue-600">Gender</Label>
                    <Input id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="mt-1" />
                  </div>
                  <div className="flex items-center">
                    <Input id="isDoctor" type="checkbox" checked={isDoctor} onChange={(e) => setIsDoctor(e.target.checked)} className="mr-2" />
                    <Label htmlFor="isDoctor" className="text-blue-600">Is Doctor</Label>
                  </div>
                  <Button onClick={handleRegister} className="w-full bg-blue-600 hover:bg-blue-700">Register</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-700">Token Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-800">{balance} HCT</p>
              <p className="mt-2 text-gray-600">Your current Healthcare Token balance</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;