import { IntlProvider, Text } from 'preact-i18n';
import { connect }            from 'react-redux';
import { Link }               from 'preact-router';
import _const                 from '../../../const';
import style                  from './style.css';

const { RESULTS_PER_PAGE } = _const;

function Paging({ lang, count, city, page }) {
  const pageCount = Math.ceil(count / RESULTS_PER_PAGE);
  const startsAt = 1 + (page - 1) * RESULTS_PER_PAGE;
  const endsAt = Math.min(page * RESULTS_PER_PAGE, count);

  return count > 0 && (
    <IntlProvider definition={definition[lang]}>
      <div className={style.paging}>
        <nav>
          <ul>
            { page > 1 ? (
              <li>
                <Link href={`/${lang}/search/${city}/${page-1}`}>❬</Link>
              </li>
            ) : '' }
            {Array.from(Array(pageCount)).map((undef, i) => (
              <li className={i+1 === page ? style.activeLink : ''}>
                <Link href={`/${lang}/search/${city}/${i+1}`}>{i+1}</Link>
              </li>
            ))}
            { page < pageCount ? (
              <li>
                <Link href={`/${lang}/search/${city}/${page+1}`}>❭</Link>
              </li>
            ) : '' }
          </ul>
        </nav>
        <p>
          <Text id="paging" fields={{ startsAt, endsAt, count }}>
            {`Rooms ${startsAt} to ${endsAt} of ${count}`}
          </Text>
        </p>
      </div>
    </IntlProvider>
  );
}

const definition = {
  'fr-FR': {
  paging: 'Chambres {{startsAt}} à {{endsAt}} sur {{count}}',
  },
  'fr-FR': {
  paging: 'Habitaciones {{startsAt}} à {{endsAt}} sobre {{count}}',
  },
};

const mapStateToProps = ({ route: { lang, city, page }, search: { count } }) => ({
  lang,
  count: count || 0,
  city,
  page: page || 1,
});

export default connect(mapStateToProps)(Paging);
