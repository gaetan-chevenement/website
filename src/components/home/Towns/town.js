import { town } from './style.css';

export default function Town({ name, roomsCount, image }) {
  return (
    <a
      href={`/fr-FR/search/${name}`}
      className={town}
      style={{ backgroundImage: `url(${image})` }}
    >
      <h3>
        {' '}{name}{' '}
      </h3>
      <div>
        {' '}{roomsCount} chambres{' '}
      </div>
    </a>
  );
}
