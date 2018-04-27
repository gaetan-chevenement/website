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
        <b>★&nbsp;★&nbsp;★&nbsp;★&nbsp;★</b>
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
    comment: `
      The team was very helpful and friendly throughout my stay.
      I settled in quickly and easily.
      The maintenance of the house was impeccable. Thanks :)
    `,
    author: 'Anna, 22 years old, Australian',
  }, {
    title: 'Very cosy flat',
    comment: `
      I really enjoyed discovering the city with my roommates and
      concentrating on my studies: everything is already ready in the
      accommodation, there is nothing more to take care of.
    `,
    author: 'Max, 25 years old, German',
  }, {
    title: 'So simple!',
    comment: `
      The reservation is super simple, and I loved having international
      roommates. I have already tested the service in 3 cities for 2 years
      for internships and semesters.
    `,
    author: 'Emilie, 23 years old, French',
  }],
  'fr-FR': [{
    title: 'Service parfait',
    comment: `
      L'équipe a été très utile et agréable pendant tout mon séjour. Mon
      installation a été facile et rapide. L'entretien du logement était
      impeccable. Merci :)
    `,
    author: 'Anna, 22 ans, Australienne',
  }, {
    title: 'Appartement très confortable',
    comment: `
      J'ai beaucoup apprécié de découvrir la ville avec mes colocs et me
      concentrer sur mes études : tout est déjà prêt dans le logement, il
      n'y a plus rien à s'occuper.
    `,
    author: 'Max, 25 ans, Allemand',
  }, {
    title: 'Super simple !',
    comment: `
      La réservation est super simple, et j'ai adoré avoir des colocataires
      internationaux. J'ai déjà testé le service dans 3 villes depuis 2 ans
      pour des stages et semestres.
    `,
    author: 'Émilie, 23 ans, Française',
  }],
};

export default Utils.connectLang(Testimonies);
