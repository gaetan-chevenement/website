import Utils            from '~/utils';
import style            from './style.css';

function Testimonies({ lang }) {
  return (
    <section className={style.testimonies}>
      {definition[lang].map((t, i) => <Testimony {...t} i={i} />)}
    </section>
  );
}

function Testimony({ title, comment, author, i }) {
  return (
    <div className={style.testimony}>
      <img src={require(`../../../assets/home/testimony-${i+1}-imageoptim.jpg`)} />
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
      <div className={`${style.authors} text-bold`}>
        {author}
      </div>
    </div>
  );
}

const definition = {
  'en-US': [{
    title: 'Perfect customer service',
    comment: [
      'The team was very helpful and enjoyable throughout my stay.',
      'My installation was quick and easy.',
      'The maintenance of the house was impeccable. Thanks :)',
    ].join(' '),
    author: 'Anna, 22 years old, Australian',
  }, {
    title: 'Appartement très confortable',
    comment: [
      'I really enjoyed discovering the city with my roommates and',
      'concentrating on my studies: everything is already ready in the',
      'accommodation, there is nothing more to take care of.',
    ].join(' '),
    author: 'Max, 25 years old, German',
  }, {
    title: 'Super simple',
    comment: [
      'The reservation is super simple, and I loved having international',
      'roommates. I have already tested the service in 3 cities for 2 years',
      'for internships and semesters.',
    ].join(' '),
    author: 'Emilie, 23 years old, French',
  }],
  'fr-FR': [{
    title: 'Service parfait',
    comment: [
      'L\'équipe a été très utile et agréable pendant tout mon séjour. Mon',
      'installation a été facile et rapide. L\'entretien du logement était',
      'impeccable. Merci :)',
    ].join(' '),
    author: 'Anna, 22 ans, Australienne',
  }, {
    title: 'Appartement très confortable',
    comment: [
      'J\'ai beaucoup apprécié de découvrir la ville avec mes colocs et me',
      'concentrer sur mes études : tout est déjà prêt dans le logement, il',
      'n\'y a plus rien à s\'occuper.',
    ].join(' '),
    author: 'Max, 25 ans, Allemand',
  }, {
    title: 'Super simple',
    comment: [
      'La réservation est super simple, et j\'ai adoré avoir des colocataires',
      'internationaux. J\'ai déjà testé le service dans 3 villes depuis 2 ans',
      'pour des stages et semestres.',
    ].join(' '),
    author: 'Emilie, 23 ans, Française',
  }],
};

export default Utils.connectLang(Testimonies);
