import { faCheck, faTriangleExclamation, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Status({status}){
  switch(status){
    case "OPERATING":
      return (
        <div className='status-div'>
          <p>OPEN</p>
          <FontAwesomeIcon icon={faCheck} style={{color: "#197328", margin: '0 4px'}} />
        </div>
      );
    case "REFURBISHMENT":
    case "CLOSED":
      return (
        <div className='status-div'>
          <p>CLOSED</p>
          <FontAwesomeIcon icon={faX} style={{color: "#f00", margin: '0 4px'}} />
        </div>
      );
    case "DOWN":
      return (
        <div className='status-div'>
          <p>DOWN</p>
          <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#fcb00a", margin: '0 4px'}} />
        </div>
      );
    default:
      return <p>{status}</p>
  }  
}