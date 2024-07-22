
function Card({ child, openLink }){
  return (
    <div className='card' key={"card-" + child} >
      <div className='card2' onClick={() => openLink(child.id)}>
        <img className="card-img" src="" alt=""/>
        <div className="card-desc">
          <div className="card-row">
            <p className="card-name" style={{color: 'white'}} >{child.name ?? child.ParkName}</p>
            <div className="card-stars">
              <p style={{margin: '0 0 0 4px'}}>{child?.queue?.STANDBY?.waitTime ? child.queue.STANDBY.waitTime : "-"}</p>
              <i>⌚</i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;