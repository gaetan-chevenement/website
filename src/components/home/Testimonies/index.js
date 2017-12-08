import { ContentTestimonies } from '~/content';

import {
  testimonies,
  testimony,
  authors,
} from './style.css';

export default function Testimonies() {
  const $testimonies = ContentTestimonies.list.map(t => <Testimony {...t} />);

  return (
    <section className={testimonies}>
      {$testimonies}
    </section>
  );
}

function Testimony({ avatar, title, comment, author }) {
  return (
    <div className={testimony}>
      <img src={avatar} />
      <h3>
        {title}{' '}
        <i class="material-icons">star_rate</i>
        <i class="material-icons">star_rate</i>
        <i class="material-icons">star_rate</i>
        <i class="material-icons">star_rate</i>
        <i class="material-icons">star_rate</i>
      </h3>

      <p>
        {comment}
      </p>
      <div className={authors}>
        {author}
      </div>
    </div>
  );
}
