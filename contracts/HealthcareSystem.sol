// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract HealthcareTokenSystem is ERC20, Ownable, ERC20Permit {
    struct User {
        string name;
        uint age;
        string gender;
        bool isDoctor;
        bool isRegistered;
    }

    struct Appointment {
        address patient;
        address doctor;
        uint256 timestamp;
        bool isConfirmed;
    }

    mapping(address => User) public users;
    Appointment[] public appointments;

    event UserRegistered(address indexed userAddress, string name, bool isDoctor);
    event AppointmentBooked(address indexed patient, address indexed doctor, uint256 timestamp, uint256 appointmentId);
    event AppointmentConfirmed(address indexed patient, address indexed doctor, uint256 timestamp, uint256 appointmentId);

    constructor(address initialOwner) 
        ERC20("HealthcareToken", "HCT") 
        Ownable(initialOwner) 
        ERC20Permit("HealthcareToken") 
    {
        _mint(msg.sender, 10000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    