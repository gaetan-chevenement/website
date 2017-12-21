import style from './style.css';

const Questions = () => (
  <div className={style.questions}>
    <h2 className="text-center">Une question ?</h2>
    <div className={['text-center', style.subtitle].join(' ')}>
        Notre équipe sera ravie de vous aider !
    </div>
    <div className={style.questionsSplit}>
      <div>
        <div className="btn">Poser une question</div>
        <div className="btn">Demander une visite</div>
      </div>
      <div>
        <div>0 972 323 102</div>
        <p>International +33 972 323 102</p>
        <p>Du lundi au vendredi de 9h à 18h</p>
      </div>
    </div>
  </div>
);


export default Questions;

