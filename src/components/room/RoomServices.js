import Utils           from '~/utils';
import style from './style.css';

function RoomServices({ lang }) {
  return (
    <div className="content content-wide">
      <div className={`grid-4 ${style.services}`}>
        { definition[lang].map(props => <Service {...props} /> )}
      </div>
    </div>
  );
}

function Service({ title, desc, imgIndex }) {
  return (
    <div className={`one-querter ${style.service}`}>
      <img src={require(`../../assets/home/experience-${imgIndex}-imageoptim.png`)} />
      <h5>{title}</h5>
      <p>{desc}</p>
    </div>
  );
}

const definition = {
  'en-US': [{
    imgIndex: 2,
    title: '100% furnished',
    desc: 'Our accommodations are furnished with care to offer design and comfort',
  }, {
    imgIndex: 3,
    title: 'Fitted from A à Z',
    desc: 'Just bring your suitcase, we\'ll handle the rest!',
  }, {
    imgIndex: 4,
    title: 'All inclusive',
    desc: 'Insurance, wifi, gas... No hidden fees',
  }, {
    imgIndex: 6,
    title: 'Quick booking',
    desc: 'A few clicks: booking has never been so easy',
  }],
  'fr-FR': [{
    imgIndex: 2,
    title: 'Meublés à 100%',
    desc: 'Nos logements sont meublés avec soin pour offrir design et confort',
  }, {
    imgIndex: 3,
    title: 'Équipés de A à Z',
    desc: 'N\'apportez que votre valise, nous gérons le reste !',
  }, {
    imgIndex: 4,
    title: 'Tout inclus',
    desc: 'Assurance, wifi, gaz... Aucun frais caché',
  }, {
    imgIndex: 6,
    title: 'Réservation rapide',
    desc: 'Quelques clics : réserver n\'a jamais été aussi simple',
  }],
  'es-ES': [{
    imgIndex: 2,
    title: 'Amueblados al 100%',
    desc: 'Nuestros apartamentos son cuidadosamente amueblados para ofrecer diseño y comodidad.',
  }, {
    imgIndex: 3,
    title: 'Totalmente equipados',
    desc: 'Solamente traiga su maleta, nos encargamos del resto!',
  }, {
    imgIndex: 4,
    title: 'Todo Incluido',
    desc: 'Seguro de vivienda, wifi, gas... Sin gastos adicionales',
  }, {
    imgIndex: 6,
    title: 'Reserva rápida',
    desc: 'En pocos clics. Reservar nunca ha sido tan fácil!',
  }],
};

export default Utils.connectLang(RoomServices);
