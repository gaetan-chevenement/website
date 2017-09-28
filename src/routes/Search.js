import SearchForm from '~/containers/search/SearchForm';

export default function SearchPage({ city }) {
  return (
    <div class="content">
      <SearchForm city={city} />
    </div>
  );
}
