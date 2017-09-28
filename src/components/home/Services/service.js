import { service } from './style.css';

export default function Service({ title, subtitle, image }) {
  return (
    <div className={service}>
      <img src={image} alt={title} />
      <h3>
        {' '}{title}{' '}
      </h3>
      <h4>
        {' '}{subtitle}{' '}
      </h4>
    </div>
  );
}
