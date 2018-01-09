import { PureComponent }      from 'react';
import style                  from './style.css';
import { RoomServices } from  '~/content';


const Service = ({ title, desc, img }) => (
  <div className={style.service + ' one-quarter'}>
    <img src={img} />
    <h5>{title}</h5>
    <p>{desc}</p>
  </div>
);

class RServices extends PureComponent {
  render() {
    return (
      <div className="content content-wide">
        <div className={['grid-4', style.services].join(' ')}>
          { RoomServices.map(props => <Service {...props} /> )}
        </div>
      </div>
    );
  }
}

export default RServices;
