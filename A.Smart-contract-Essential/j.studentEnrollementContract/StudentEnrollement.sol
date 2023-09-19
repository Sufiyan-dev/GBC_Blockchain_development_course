// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract StudentEnrollment {


    // custom data type
    struct Student {
        string name;
        uint class;
        uint year_enrolled;
    }

    // aka admin
    address public teacher;

    // current student number
    uint studentNumber;

    // Event
    event Added(string indexed  name, uint indexed  class, uint year_enroll);

    mapping(uint => Student) public stuview;

    modifier isTeacher {
        require(msg.sender == teacher,"only teacher");
        _;
    }

    constructor() {
        teacher = msg.sender;
        studentNumber = 11900700;
    }

    function addStudent(string memory _name, uint _class, uint _year_enroll) public isTeacher {
        require(_class > 0 && _class <=10,"invalid calss number");

        Student memory student = Student(_name, _class, _year_enroll);
        studentNumber++;
        stuview[studentNumber] = student;

        emit Added(_name, _class, _year_enroll);
    }

}