import { useLocation, useNavigate } from 'react-router-dom';

const useSearchName = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location?.pathname;

  const onChangeSearch = (e: any, setName: any, searchQuery: any, setSearchQuery: any, searchQueryString: string) => {
    let newSearchQuery;
    setName(e.target.value);
    if (e.target.value === '') {
      delete searchQuery?.keyword;
      newSearchQuery = { ...searchQuery };
    } else {
      newSearchQuery = { ...searchQuery, keyword: e.target.value };
    }
    setSearchQuery(newSearchQuery);
    searchQueryString = new URLSearchParams(newSearchQuery).toString();
    navigate(`${pathName}?${searchQueryString}`);
  }

  return {
    onChangeSearch,
  }
}

export default useSearchName