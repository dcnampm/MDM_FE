import { useLocation } from 'react-router-dom';

export default function useQuery() {
  let search = useLocation().search;
  // if(search.match())
  if (search.length === 0 || search[0] !== `?`) return {};
  let objParams = Object.fromEntries(
    search
      .slice(1)
      .split('&')
      .map((x) => x.split(/=(.+)/))
      .filter((x) => x[0] !== '' && x[1] !== undefined)
      .map((x: any) => {
        x[1] = decodeURIComponent(x[1].replace(/%(?!\d|[ABCDEF]+)/g, '%25'));
        if (/^-?\d+$/.test(x[1]) && !/^0/.test(x[1])) x[1] = parseInt(x[1]);
        return [x[0], x[1]];
      })
  );

  return objParams || {};

  // return new URLSearchParams(useLocation().search);
}
