import React, { useEffect, useRef, useState } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';

const EditorPage = () => {

  const navigate = useNavigate();

  const socketRef = useRef(null);
  const codeRef = useRef(null);

  const location = useLocation();

  const {roomId} = useParams();

  const [clients, setClients] = useState([]);


  async function copyRoomId(){
    try {
        await navigator.clipboard.writeText(roomId);
        toast.success('Copied')
    } catch (err) {
        toast.error('could not copy the room ID');
        console.log(err);
    }
  }

  function exitRoom (){
    navigate('/');
  }

  

  useEffect(()=>{

    const init =async()=>{
      socketRef.current = await initSocket();      //socket connection event

      socketRef.current.on('connect_error',(err)=>handleErrors(err));
      socketRef.current.on('connect_failed',(err)=>handleErrors(err));

      const handleErrors=(e)=>{
        console.log('socket error',e);
        toast.error('Socket connection failed , try again');
        navigate('/');
      }


      socketRef.current.emit(ACTIONS.JOIN,{
        roomId,
        username:location.state?.username,
      })    
    
      //joined event
      socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId})=>{
           if(username!== location.state?.username){
              toast.success(`${username} joined the room.`)
              console.log(`${username} joined`);
           }    //location.state.username means own username

           setClients(clients);
           ///if person write code and leave amd joined again , them this will show the aleady present code immediately
           socketRef.current.emit(ACTIONS.SYNC_CODE,{
              code : codeRef.current,
              socketId
           });
      })

      //disconnected event
      socketRef.current.on(ACTIONS.DISCONNECTED,({username,socketId})=>{
        toast.success(`${username} left the room.`);
        setClients((prev)=>{
          return prev.filter(
            (client)=> client.socketId!==socketId
          )
        })
      })

      


    }   
    init();

    return()=>{
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    }

  },[]);


  if(!location.state){
    <Navigate to='/' />
  }

  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
          <div className='logo'>
            <img className='logoImage' src='/logo.png' alt='logo'/>
          </div>
          <h3>Connected!!</h3>
          <div className='clientList'>
            {
              clients.map((client)=>(<Client
                key={client.socketId} username={client.username}
              />))
            }
          </div>
        </div>

        <button className='btn copyBtn' onClick={copyRoomId}>Copy RoomID</button>
        <button className='btn exitBtn' onClick={exitRoom}>Exit Room</button>

      </div>
      
      <div className='editorWrap'>
        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{codeRef.current=code}} />
      </div>
    </div>
  )
}

export default EditorPage