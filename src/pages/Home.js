import React, { useEffect, useState } from 'react'
import {v4 as uuidv4} from 'uuid'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';






const Home = () => {


  
  const navigate = useNavigate();
  const [roomId , setRoomId] = useState('');
  const [username , setUsername] = useState('');

  const createNewRoom =(e)=>{
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    // console.log(id);
    toast.success('Created a new room');
  }

  const joinRoom =()=>{
    if(!username || !roomId){
      toast.error('RoomID & username is required');
      return;
    }

    sessionStorage.setItem("username",username);

    navigate(`/editor/${roomId}`,{
      state:{username}, //to access username on 2nd page (state management)
    })
  }

  const handleEnter =(e)=>{
    // console.log(e.code);
    if(e.code=='Enter'){
      joinRoom();
    }
  }

  return (
    <div className='landingPage banner'>
      <div className='formBox'>

        <div className='logoAndName'>
          <img className='landinglogo' src='/logo.png' alt='code-connect-logo'/>
          <h2 className='codeConnectName'>Code-Connect</h2>  
        </div>

        <h4 className='label'>Enter Room ID to connect</h4>
        <div className='inputGroup'>
          <input type='text' className='inputBox' onChange={(e)=>setRoomId(e.target.value)} 
                value={roomId} onKeyDown={handleEnter} placeholder='Unique Room ID'/>

          <input type='text' className='inputBox' onChange={(e)=>setUsername(e.target.value)} 
                value={username} onKeyDown={handleEnter} placeholder='Username'/>
          <button className='btn joinbtn' onClick={joinRoom}>Join</button>
          <span className='newid'> if you don't have invite then create &nbsp; 
            <a onClick={createNewRoom} href='' className='newidbtn'>new room</a> </span>
        </div>

      </div>

      <footer>
        {/* <h4>Built by <a href=''>code-connect</a> ✨ </h4> */}
        <h4> ✨ Happy Coding ✨</h4>
      </footer>

    </div>
  )
}

export default Home