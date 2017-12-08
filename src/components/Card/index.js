import style                  from './style';

export default function Card({ image, title, content }) {
  return (
    <div class={style.card}>
      <img src={image} />
      <h2 class={style.cardTitle}>{title}</h2>
      <hr class={style.cardRuler} />
      <p class={style.cardContent}>{content}</p>
    </div>
  );
}
