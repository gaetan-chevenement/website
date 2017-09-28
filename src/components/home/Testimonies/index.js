import Testimony from './testimony.js';
import { ContentTestimonies } from '~/content';

import { testimonies } from './style.css';

export default function Testimonies() {
  const $testimonies = ContentTestimonies.list.map(t => <Testimony {...t} />);

  return (
    <section className={testimonies}>
      {$testimonies}
    </section>
  );
}
