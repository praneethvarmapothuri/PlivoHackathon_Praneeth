import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';


import ResponsiveAppBar from "./Navbar";
import "./Devices.css"
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import DoctorNavBar from './DoctorNavbar';

const tableData = [
  {
    id: 1,
    name: 'Suraj',
    age: 30,
    address: 'Gujrat'
  },
  {
    id: 2,
    name: 'Vir',
    age: 25,
    address: 'Vihar'
  },
  // Add more objects as needed
];





function DoctorMedications() {
    const [medicationData,setMedicationData] = useState([]) ;

    useEffect(() => {
        axios.get("http://localhost:4000/medication/getByDoctorId/"+localStorage.getItem('DoctorId')).then(res => {
            setMedicationData(res.data) ;
        })
    }, []);

    function handleClick(id) {
        var medicationId = medicationData[id]._id ;
        axios.post("http://localhost:4000/medication/delete",{'medicationId':medicationId}).then(res=>{
            axios.get("http://localhost:4000/medication/getByDoctorId/"+localStorage.getItem('DoctorId')).then(res1 => {
                setMedicationData(res1.data) ;
            })       
        })
      }

  return (
    <div className='main-header'>
        <DoctorNavBar></DoctorNavBar>
        <br /><br /><br /><br /><br /><br /><br /><br />

    <TableContainer style={{height: 1000, width: '85%', marginLeft: "7.5%", border: "1px solid black", borderRadius: "2px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>S.No</TableCell>
            <TableCell>Patient Name</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Dosage</TableCell>
            <TableCell>Healthissue</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {medicationData.map((row,index) => (
            <TableRow key={index}>
              <TableCell>{index+1}</TableCell>
              <TableCell>{row.UserName}</TableCell>
              <TableCell>{row.Time}</TableCell>
              <TableCell>{row.Dosage}</TableCell>
              <TableCell>{row.Healthissue}</TableCell>
              <TableCell>
                <Button variant="contained" onClick={() => handleClick(index)}>End Medication</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}

export default DoctorMedications;