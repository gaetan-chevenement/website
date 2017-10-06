import { town } from './style.css';

export default function Town({ lang, name, roomsCount, image }) {
  return (
    <a
      href={`/${lang}/search/${name.toLowerCase()}`}
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
