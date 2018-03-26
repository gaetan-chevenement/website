import { h }                  from 'preact';
import { connect }            from 'react-redux';
import { Link }               from 'preact-router';
import _const                 from '../../../const';
import style                  from './style.css';

const { RESULTS_PER_PAGE } = _const;

function Paging({ lang, count, city, page }) {
  const pageCount = Math.ceil(count / RESULTS_PER_PAGE);
  const startsAt = (page - 1) * RESULTS_PER_PAGE;
  const endsAt = Math.min(page * RESULTS_PER_PAGE, count);

  return (
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
        Chambres {startsAt} à {endsAt} sur {count}
      </p>
    </div>
  );
}

const mapStateToProps = ({ route: { lang, city, page }, search: { count } }) => ({
  lang,
  count: count || 1,
  city,
  page: page || 1,
});

export default connect(mapStateToProps)(Paging);
