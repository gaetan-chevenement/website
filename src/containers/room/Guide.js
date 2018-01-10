import style from './style.css';

const Guide = () => (
  <div className={style.guide}>
    <div>
      <h2>Notre guide logement offert</h2>
      <div className="grid-2">
        <ul className="one-half">
          <li>Où chercher son logement</li>
          <li>Agences, résidences...</li>
        </ul>
        <ul className="one-half">
          <li>Les pièges à éviter</li>
          <li>Les frais à prévoir</li>
        </ul>
      </div>
      <div>
        <a href="/" className={style.downloadGuideBtn}>
          Je télécharge mon Guide Logement
        </a>
      </div>
    </div>
  </div>
);


export default Guide;

