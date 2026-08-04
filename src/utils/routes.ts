import { ViewMode } from '../components/Navbar';

const VIEW_PATHS: Record<ViewMode, string> = {
  home: '/',
  gospel: '/gospel',
  prayers: '/prayers',
  rosary: '/rosary',
  candle: '/light-a-candle',
  commandments: '/commandments',
  calendar: '/calendar',
  saints: '/saints',
  reflection: '/reflection',
  guestbook: '/visitors-book',
  silence: '/silence',
  about: '/about',
  'full-sanctuary': '/sanctuary',
};

const VIEW_TITLES: Record<ViewMode, string> = {
  home: 'By His Light • A Quiet Chapel on the Internet',
  gospel: 'Daily Gospel • By His Light',
  prayers: 'Prayers • By His Light',
  rosary: 'Holy Rosary • By His Light',
  candle: 'Light a Candle • By His Light',
  commandments: '10 Commandments • By His Light',
  calendar: 'Liturgical Calendar • By His Light',
  saints: 'Saints • By His Light',
  reflection: 'Reflection • By His Light',
  guestbook: "Visitors' Book • By His Light",
  silence: 'Silence Mode • By His Light',
  about: 'About • By His Light',
  'full-sanctuary': 'Sanctuary • By His Light',
};

export function viewPath(view: ViewMode): string {
  return VIEW_PATHS[view];
}

export function pathToView(path: string): ViewMode {
  const cleaned = path.split('?')[0].replace(/\/+$/, '') || '/';
  const entry = Object.entries(VIEW_PATHS).find(([, p]) => p === cleaned);
  return entry ? (entry[0] as ViewMode) : 'home';
}

export function viewTitle(view: ViewMode): string {
  return VIEW_TITLES[view];
}
