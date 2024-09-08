pragma solidity ^0.8.0;

contract HealthcareSystem {
    struct User {
        string name;
        uint age;
        string gender;
        bool isDoctor;
    }

    struct Appointment {
        address patient;
        address doctor;
        uint256 timestamp;
        bool isConfirmed;
    }

    mapping(address => User) public users;
    Appointment[] public appointments;

    event AppointmentBooked(address indexed patient, address indexed doctor, uint256 timestamp);
    event AppointmentConfirmed(address indexed patient, address indexed doctor, uint256 timestamp);

    function registerUser(string memory _name, uint _age, string memory _gender, bool _isDoctor) public {
        users[msg.sender] = User(_name, _age, _gender, _isDoctor);
    }

    function bookAppointment(address _doctor, uint256 _timestamp) public {
        require(users[msg.sender].age > 0, "Patient not registered");
        require(users[_doctor].isDoctor, "Invalid doctor address");

        appointments.push(Appointment(msg.sender, _doctor, _timestamp, false));
        emit AppointmentBooked(msg.sender, _doctor, _timestamp);
    }

    function confirmAppointment(uint256 _appointmentId) public {
        require(users[msg.sender].isDoctor, "Only doctors can confirm appointments");
        require(_appointmentId < appointments.length, "Invalid appointment ID");
        require(appointments[_appointmentId].doctor == msg.sender, "Not authorized");

        appointments[_appointmentId].isConfirmed = true;
        emit AppointmentConfirmed(appointments[_appointmentId].patient, msg.sender, appointments[_appointmentId].timestamp);
    }

    function getUserProfile(address _user) public view returns (string memory, uint, string memory, bool) {
        User memory user = users[_user];
        return (user.name, user.age, user.gender, user.isDoctor);
    }
}