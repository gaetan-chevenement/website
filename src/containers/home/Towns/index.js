import { connect }        from 'react-redux';
import _const             from '~/const';
import Town               from './town';
import style              from './style';

const { SEARCHABLE_CITIES } = _const;

function Towns({ lang }) {
  return (
    <section class={`grid-3-large-1 has-gutter ${style.towns}`}>
      {SEARCHABLE_CITIES
        .filter(({ image }) => Boolean(image))
        .map((town) => (
          <Town
            lang={lang}
            name={town.name}
            roomsCount={town.roomsCount}
            image={town.image}
          />
        ))
      }
    </section>
  );
}

const mapStateToProps = ({ route: { lang } }) => ({
  lang,
});

export default connect(mapStateToProps)(Towns);
