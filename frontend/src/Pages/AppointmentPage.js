import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

// Import ABI and contract address
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants';

const AppointmentPage = () => {
  const [contract, setContract] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();

          const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          setContract(contractInstance);

          // Fetch user profile
          try {
            const profile = await contractInstance.getUserProfile(address);
            setUserProfile(profile);
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }

          // Fetch appointments
          const appointmentsCount = await contractInstance.getAppointmentsCount();
          const fetchedAppointments = [];
          for (let i = 0; i < appointmentsCount; i++) {
            const appointment = await contractInstance.getAppointment(i);
            if (appointment.patient === address || appointment.doctor === address) {
              fetchedAppointments.push(appointment);
            }
          }
          setAppointments(fetchedAppointments);
        } catch (error) {
          console.error("Error initializing:", error);
        }
      }
    };

    init();
  }, []);

  const handleBookAppointment = async (doctorAddress, timestamp) => {
    try {
      const tx = await contract.bookAppointment(doctorAddress, timestamp);
      await tx.wait();
      alert("Appointment booked successfully!");
      // Refresh appointments list
      window.location.reload();
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Booking failed. See console for details.");
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">Appointments</h1>

        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-700">Your Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {appointments.map((appointment, index) => (
                  <li key={index} className="py-4">
                    <p><strong className="text-blue-600">Patient:</strong> {appointment.patient}</p>
                    <p><strong className="text-blue-600">Doctor:</strong> {appointment.doctor}</p>
                    <p><strong className="text-blue-600">Time:</strong> {new Date(appointment.timestamp * 1000).toLocaleString()}</p>
                    <p><strong className="text-blue-600">Status:</strong> {appointment.isConfirmed ? 'Confirmed' : 'Pending'}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No appointments found.</p>
            )}
          </CardContent>
        </Card>

        {userProfile && !userProfile.isDoctor && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-700">Book New Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="doctorAddress" className="text-blue-600">Doctor Address</Label>
                  <Input id="doctorAddress" placeholder="0x..." className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="appointmentTime" className="text-blue-600">Appointment Time</Label>
                  <Input id="appointmentTime" type="datetime-local" className="mt-1" />
                </div>
                <Button 
                  onClick={() => handleBookAppointment(
                    document.getElementById('doctorAddress').value,
                    Math.floor(new Date(document.getElementById('appointmentTime').value).getTime() / 1000)
                  )}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Book Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AppointmentPage;