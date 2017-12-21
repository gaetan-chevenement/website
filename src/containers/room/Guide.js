import style from './style.css';

const Guide = () => (
  <div className={style.guide}>
    <div>
      <h2 className="text-center">Notre guide logement offert</h2>
      <div className={style.guideFeatures}>
        <ul>
          <li>Où chercher son logement</li>
          <li>Agences, résidences...</li>
        </ul>
        <ul>
          <li>Les pièges à éviter</li>
          <li>Les frais à prévoir</li>
        </ul>
      </div>
      <div>
        <a href="/">Je télécharge mon Guide Logement</a>
      </div>
    </div>
  </div>
);


export default Guide;

