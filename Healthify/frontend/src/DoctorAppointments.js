import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';


import DoctorNavBar from './DoctorNavbar';
import "./Devices.css"
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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





function DoctorAppointments() {
    const [AppointmentData, setAppointmentData] = useState([]);
    const [open, setOpen] = useState(false);
    const [Index,setIndex]= useState() ;
    const [Dosage,setDosage] = useState('') ;
    const [Time,setTime] = useState('') ;
    const [userData,setUserData] = useState([]) ;
    const handleClickOpen = (ind) => {
        setIndex(ind) ;
        setOpen(true);
    };

    const handleX = (e) => {
        setDosage(e.target.value) ;
    };

    const handleY = (e) => {
        setTime(e.target.value) ;
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        axios.get("http://localhost:4000/appointment/getByDoctorId/" + localStorage.getItem('DoctorId'),).then(res => {
            setAppointmentData(res.data);
            console.log(res.data);
        })
    }, []);


    function handleClick(id) {
        var AppointmentId = AppointmentData[id]._id;
        axios.post("http://localhost:4000/appointment/approve", { 'AppointmentId': AppointmentId }).then(res => {
            axios.get("http://localhost:4000/appointment/getByDoctorId/" + localStorage.getItem('DoctorId'),).then(res1 => {
                setAppointmentData(res1.data);
                console.log(res1.data);
            })
        })
    }
    const addMedication = () =>{
        var phoneNumber = null ;
        console.log(Index) ;
        console.log(AppointmentData) ;
        axios.get("http://localhost:4000/user/getById/"+AppointmentData[Index].PatientId,).then(res => {
            for(var i=0;i<res.data.length;i++){
                if(res.data[i]._id===AppointmentData[Index].PatientId){
                    phoneNumber = res.data[i].phoneNumber ;
                }
            }
            const data = {
                'DoctorId':AppointmentData[Index].DoctorId,
                'DoctorName':AppointmentData[Index].DoctorName,
                'UserId':AppointmentData[Index].PatientId,
                'UserName':AppointmentData[Index].PatientName,
                'Time':Time,
                'UserPhoneNumber':phoneNumber,
                'Healthissue':AppointmentData[Index].Healthissue,
                'Dosage':Dosage,
    
            }
            axios.post("http://localhost:4000/medication/add",data).then(res=>{
                alert("Added") ;
            }) 
        })
      

        setOpen(false);
    }

    return (
        <div className='main-header'>
            {/* <ResponsiveAppBar></ResponsiveAppBar> */}
            <DoctorNavBar></DoctorNavBar>
            <br /><br /><br /><br /><br /><br /><br /><br />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Medication</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Dosage"
                        value={Dosage}
                        style={{ marginLeft: "15%", width: "70%" }}
                        variant="outlined"
                        onChange={handleX}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        value={Time}
                        label="Time"
                        style={{ marginLeft: "15%", width: "70%" }}
                        variant="outlined"
                        onChange={handleY}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={addMedication}>Add Medication</Button>
                </DialogActions>
            </Dialog>
            <TableContainer style={{ height: 1000, width: '85%', marginLeft: "7.5%", border: "1px solid black", borderRadius: "2px" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Patient Name</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Healthissue</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {AppointmentData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row.PatientName}</TableCell>
                                <TableCell>{row.Date}</TableCell>
                                <TableCell>{row.Healthissue}</TableCell>
                                <TableCell>{row.Status}</TableCell>
                                {row.Status == "Pending" &&
                                    <TableCell>
                                        <Button variant="contained" onClick={() => handleClick(index)}>Approve Appointment</Button>
                                    </TableCell>}
                                    {row.Status == "Approved" &&
                                    <TableCell>
                                        <Button variant="contained" onClick={()=>handleClickOpen(index)}>Add Medication</Button>
                                    </TableCell>}                                    
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default DoctorAppointments;