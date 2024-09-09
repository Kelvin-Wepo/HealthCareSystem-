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

    modifier onlyRegisteredUser() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }

    modifier onlyDoctor() {
        require(users[msg.sender].isDoctor, "Only doctors can perform this action");
        _;
    }

    function registerUser(string memory _name, uint _age, string memory _gender, bool _isDoctor) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        require(_age > 0, "Invalid age");
        users[msg.sender] = User(_name, _age, _gender, _isDoctor, true);
        emit UserRegistered(msg.sender, _name, _isDoctor);
    }

    function bookAppointment(address _doctor, uint256 _timestamp) public onlyRegisteredUser {
        require(users[_doctor].isDoctor, "Invalid doctor address");
        require(_timestamp > block.timestamp, "Appointment time must be in the future");

        uint256 appointmentId = appointments.length;
        appointments.push(Appointment(msg.sender, _doctor, _timestamp, false));
        emit AppointmentBooked(msg.sender, _doctor, _timestamp, appointmentId);

        // Transfer tokens as payment for the appointment
        uint256 appointmentFee = 100 * 10 ** decimals(); // 100 tokens
        require(balanceOf(msg.sender) >= appointmentFee, "Insufficient balance for appointment");
        _transfer(msg.sender, _doctor, appointmentFee);
    }

    function confirmAppointment(uint256 _appointmentId) public onlyDoctor {
        require(_appointmentId < appointments.length, "Invalid appointment ID");
        Appointment storage appointment = appointments[_appointmentId];
        require(appointment.doctor == msg.sender, "Not authorized");
        require(!appointment.isConfirmed, "Appointment already confirmed");

        appointment.isConfirmed = true;
        emit AppointmentConfirmed(appointment.patient, msg.sender, appointment.timestamp, _appointmentId);
    }

    function getUserProfile(address _user) public view returns (User memory) {
        require(users[_user].isRegistered, "User not found");
        return users[_user];
    }

    