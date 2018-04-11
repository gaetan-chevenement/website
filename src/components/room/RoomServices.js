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
    title: 'Meublés à 100%',
    desc: 'Nos logements sont meublés averc soin pour offrir design et confort',
  }, {
    imgIndex: 3,
    title: 'Equipés de A à Z',
    desc: 'N\'apportez que votre valise, nous gérons le reste !',
  }, {
    imgIndex: 4,
    title: 'Tout inclus',
    desc: 'Assurance, wifi, gaz... Aucun frais caché',
  }, {
    imgIndex: 6,
    title: 'Réservation rapide',
    desc: 'Quelques clics : réerver n\'a jamais été aussi simple',
  }],
  'fr-FR': [{
    imgIndex: 2,
    title: 'Meublés à 100%',
    desc: 'Nos logements sont meublés averc soin pour offrir design et confort',
  }, {
    imgIndex: 3,
    title: 'Equipés de A à Z',
    desc: 'N\'apportez que votre valise, nous gérons le reste !',
  }, {
    imgIndex: 4,
    title: 'Tout inclus',
    desc: 'Assurance, wifi, gaz... Aucun frais caché',
  }, {
    imgIndex: 6,
    title: 'Réservation rapide',
    desc: 'Quelques clics : réerver n\'a jamais été aussi simple',
  }],
};

export default Utils.connectLang(RoomServices);
