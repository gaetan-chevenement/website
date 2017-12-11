import { ContentTestimonies } from '~/content';

import {
  testimonies,
  testimony,
  authors,
} from './style.css';

export default function Testimonies() {
  return (
    <section className={testimonies}>
      {ContentTestimonies.list.map(t => <Testimony {...t} />)}
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
      <div className={`${authors} text-bold`}>
        {author}
      </div>
    </div>
  );
}
