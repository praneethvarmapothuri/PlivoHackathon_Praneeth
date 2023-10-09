import "./Devices.css"
import logo from "./images/logo_black.svg"
import { Button } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import { alpha,styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useEffect, useState } from "react";
import { green } from "@mui/material/colors";
import Switch from "@mui/material/Switch";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";
import axios from "axios";

const PinkSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: "#76ff03",
      '&:hover': {
        backgroundColor: alpha("#76ff03", theme.palette.action.hoverOpacity),
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: "#76ff03",
    },
  }));


function Devices(){
    const navigate = useNavigate() ;
    const [check,Setcheck] = useState([true,false]) ;
    const [Devices,setDevices]  = useState([]) ;
    const [render,Setrender] = useState(false) ;
    if(localStorage.getItem("open")==="true"){
        localStorage.setItem("open","false") ;
    }

    useEffect(() => {
        axios.get("http://ec2-15-206-94-205.ap-south-1.compute.amazonaws.com:4000/device/").then(res =>{
            setDevices(res.data) ;
        })
      }, []);

    const changeStatus = (index) => (event) => {
        console.log(index,"hello") ;
        var val=Devices[index].status ;
        var request = {
            device_id:Devices[index]._id ,
            status:!val
        } ;
        axios.post("http://ec2-15-206-94-205.ap-south-1.compute.amazonaws.com:4000/device/update_device",request).then(res=>{
            axios.get("http://ec2-15-206-94-205.ap-south-1.compute.amazonaws.com:4000/device/").then(res =>{
                setDevices(res.data) ;
            })                
        })
    };

    function AddDevice(e){
          let name=window.prompt("Enter Name of Device") ;
          if(name==="" || name===null){
            alert("Name of Device cannot be empty") ;
          }
          else{
                const newDevice = {
                    name:name,
                    status:false,
                    heating:[],
                    cooling:[],
                    battery:[],
                    safety_low_temp:0,
                    safety_high_temp:100,
                    bag_temp:25
                }
                axios.post("http://ec2-15-206-94-205.ap-south-1.compute.amazonaws.com:4000/device/add_device",newDevice).then(res=>{
                    axios.get("http://ec2-15-206-94-205.ap-south-1.compute.amazonaws.com:4000/device/").then(resp =>{
                        setDevices(resp.data) ;
                    }).catch(err=>{
                        console.log(err) ;
                    })
                }).catch(err=>{
                    console.log(err) ;
                })
          }
      }

    const handleChildElementClick = (e) => {
        e.stopPropagation()
     }


    return(
        <div className="main-header">
            <img className="logo" src={logo} onClick={()=>{
                navigate("/") ;
            }}></img>
            <Button className= "Addbtn" onClick={AddDevice} sx={{fontSize:"12px"}} variant="contained" label="Button" labelStyle={{ fontSize: '12px'}}startIcon={<AddIcon />}>Add Device</Button>
            <br/><br/><br/>
            { Devices.map((item,index) =>
                <Fragment>
                <div onClick={()=>{
                    if(item.status){
                        localStorage.setItem("deviceid",item._id) ;
                        localStorage.setItem("open","true") ;
                        navigate("/control") ;
                    }
                }} className="devices" style={{float:"left"}}>
                    <p className="devname">{item.name}</p>
                    <p style={{marginBottom:"0px",marginTop:"30px",fontSize:"14px",color:"#ffffff"}}>{item.status ? "Connected" : "Disconnected"}</p>
                    <PinkSwitch onClick={(e) => handleChildElementClick(e)} sx={{width:"60px",marginTop:"0px"}} className="switch" checked={item.status} onChange={changeStatus(index)}/>
                </div>
                </Fragment>
            )
            }
        </div>

    )
}
export default Devices