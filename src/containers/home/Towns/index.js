import { connect }        from 'react-redux';
import { ContentTowns }   from '~/content';
import Town               from './town';

function Towns({ lang }) {
  return (
    <section class="grid-3-large-1 has-gutter">
      {ContentTowns.list.map((town) => (
        <Town
          lang={lang}
          name={town.name}
          roomsCount={town.roomsCount}
          image={town.image}
        />
      ))}
    </section>
  );
}

const mapStateToProps = ({ route: { lang } }) => ({
  lang,
});

export default connect(mapStateToProps)(Towns);
