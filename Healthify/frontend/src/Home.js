import "./Devices.css"
import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom";
import ResponsiveAppBar from "./Navbar";
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import { useEffect } from "react";



const columns = [
    { field: 'id', headerName: 'S.No', width: 70 },
    { field: 'Hospital', headerName: 'Hospital', width: 200 },
    { field: 'Doctor', headerName: 'Doctor', width: 200 },
    {
        field: 'Date',
        headerName: 'Date',
        width: 200,
    },
    {
        field: 'Location',
        headerName: 'Location',
        sortable: false,
        width: 200,
    },
    {
        field: 'Issue',
        headerName: 'Health issue',
        sortable: false,
        width: 200,
    },
    {
        field: 'Status',
        headerName: 'Status',
        sortable: false,
        width: 200,
    },
];



const rows = [
    { "id": '1', Hospital: "Apollo 24/7", Doctor: "Dr. Pothugunta Venkat", Date: '10-10-2023 3:00 PM', Location: "Kondapur,Hyderabad", Issue: "Throat Infection", Status: "Approved" }
];



function Home() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [healthIssue, setHealthIssue] = useState('');
    const [date, setDate] = useState('');
    const [doctorName,setDoctorName] = useState(null) ;
    const [doctorData, setDoctorData] = useState([]);
    const [appointmentData,setAppointmentData] = useState([]) ;
    const [rowData,setRowData] = useState([]) ;
    const [x,setX] = useState(0)

    const handleClickOpen = () => {
        setOpen(true);
    };


    const handleClose = () => {
        setOpen(false);
    };

    const bookAppointment = () =>{
        axios.get("http://localhost:4000/user/getById/"+localStorage.getItem('UserId')).then(res => {
            var Name=null ;
            for(var i=0;i<res.data.length;i++){
                if(res.data[i]._id===localStorage.getItem('UserId')){
                    Name = res.data[i].userName ;
                }
            }
            const data = {
                'Hospital':doctorData[doctorName].hospital.name,
                'DoctorId':doctorData[doctorName]._id,
                'DoctorName':doctorData[doctorName].doctorName,
                'PatientId':localStorage.getItem('UserId'),
                'PatientName':Name,
                'Date':date,
                'Location':doctorData[doctorName].hospital.location,
                'Healthissue':healthIssue,
                'Status':'Pending'
            }
            console.log(data,"he") ;
            axios.post("http://localhost:4000/appointment/book",data).then(res=>{
                axios.get("http://localhost:4000/appointment/getByUserId/"+localStorage.getItem('UserId')).then(res => {
                    let rowdata=[] ;
                    let hashmap = new Map() ;
                    for(var i=0;i<res.data.length;i++){
                        rowdata.push({"id":i+1,"Hospital":res.data[i].Hospital,"Doctor":res.data[i].DoctorName,"Date":res.data[i].Date,"Location":res.data[i].Location,"Issue":res.data[i].Healthissue,"Status":res.data[i].Status})
                    }
                    setAppointmentData(res.data);
                    setRowData(rowdata) ;           
                })
            })            
        })
        setOpen(false);
    }

    const [age, setAge] = useState('');

    const handleChange = (event) => {
        setDoctorName(event.target.value)
    };

    const handleX = (event) => {
        setHealthIssue(event.target.value)
    };

    const handleY = (event) => {
        setDate(event.target.value)
    };

    useEffect(() => {
        axios.get("http://localhost:4000/doctor/getall").then(res => {
            setDoctorData(res.data);
        })
    }, []);

    useEffect(() => {
        axios.get("http://localhost:4000/appointment/getByUserId/"+localStorage.getItem('UserId')).then(res => {
            let rowdata=[] ;
            let hashmap = new Map() ;
            for(var i=0;i<res.data.length;i++){
                rowdata.push({"id":i+1,"Hospital":res.data[i].Hospital,"Doctor":res.data[i].DoctorName,"Date":res.data[i].Date,"Location":res.data[i].Location,"Issue":res.data[i].Healthissue,"Status":res.data[i].Status})
            }
            setAppointmentData(res.data);
            setRowData(rowdata) ;           
        })
    }, []);


    return (
        <div className="main-header">
            <ResponsiveAppBar></ResponsiveAppBar>
            <br /><br /><br /><br /><br />
            <Button variant="contained" style={{ float: "right", marginRight: "2%" }} onClick={handleClickOpen}>Book Appointment</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Appointment Booking Form</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Health Issue"
                        value={healthIssue}
                        style={{ marginLeft: "15%", width: "70%" }}
                        variant="outlined"
                        onChange={handleX}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        value={date}
                        label="Date and Time (dd-mm-yyyy time) format"
                        style={{ marginLeft: "15%", width: "70%" }}
                        variant="outlined"
                        onChange={handleY}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label" style={{ marginLeft: "15%", marginTop: "2%" }}>Doctor</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={doctorName}
                            style={{ marginLeft: "15%", marginTop: "2%", width: "70%" }}
                            label="Doctor"
                            onChange={handleChange}
                        >
                        { doctorData.map((item,index) =>
                            <MenuItem value={index}>{item.doctorName}</MenuItem>
                        )
                        }
                        </Select>
                    </FormControl>
                    {doctorName!=null &&
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        value={doctorData[doctorName].specialisation}
                        label="Specialisation"
                        style={{ marginLeft: "15%", marginTop:"2%", width: "70%" }}
                        variant="outlined"
                    />
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={bookAppointment}>Book Appointment</Button>
                </DialogActions>
            </Dialog>
            <br /><br /><br />
            <div style={{ height: 1000, width: '95%', marginLeft: "3%", border: "1px solid black", borderRadius: "2px" }}>
            {rowData.length>0 && <DataGrid
                rows={rowData}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
            />
            }
        </div>
        </div>
    )
}
export default Home