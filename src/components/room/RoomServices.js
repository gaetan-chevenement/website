import style from '~/containers/room/style.css';
import { RoomServices } from '~/content';


const Service = ({ title, desc, img }) => (
  <div className={style.service + ' one-quarter'}>
    <img src={img} />
    <h5>{title}</h5>
    <p>{desc}</p>
  </div>
);

const Services = () => (
  <div className="content content-wide">
    <div className={['grid-4', style.services].join(' ')}>
      { RoomServices.map(props => <Service {...props} /> )}
    </div>
  </div>
);

export default Services;
