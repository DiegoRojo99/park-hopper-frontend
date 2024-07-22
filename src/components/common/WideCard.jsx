import './Common.css';

function WideCard({ child, openLink }){
  return (
    <div className='wide-card' onClick={() => openLink(child.id)}>
      {/* <img className='wide-card-img' src={logoImage} /> */}
      <div className='overlay'>            
        <p className='overlay-name'>{child.name}</p>
        <p className='overlay-wait'>{child?.queue?.STANDBY?.waitTime ? child.queue.STANDBY.waitTime : "-"}</p>
        <i style={{width: '5%'}}>⌚</i>
      </div>
    </div>
  );
};
  
export default WideCard;