import { 
  fetchMatches, 
  formatDate, 
  formatTime, 
  filterMatchesByDate,
  filterMatchesBySport,
  filterMatchesByLeague,
  getUniqueSports,
  getUniqueLeagues
} from '@/lib/matchesService';
import { Match } from '@/types/match';

// Mock sample data
const sampleMatches: Match[] = [
  {
    "id": "29580438",
    "title": "Old Victorians vs. Farmers",
    "hometeam": "Old Victorians",
    "awayteam": "Farmers",
    "hometeamabbr": "OLV",
    "awayteamabbr": "FRM",
    "hometeamID": "12345",
    "awayteamID": "67890",
    "starttime": "2025-03-12T14:00:00Z",
    "endtime": "2025-03-12T15:00:00Z",
    "sport": "Cricket",
    "league": "European Cricket League",
    "league_id": "17203826",
    "network": "Willow Sports (Canada)",
    "networkUrl": "https://www.fubo.tv/welcome/channel/willow-sports?irmp=365718&irad=596299",
    "matchId": "EP032826920341",
    "matchUrl": "https://www.fubo.tv/welcome/matches/EP032826920341?irmp=365718&irad=596299",
    "thumbnail": "https://imgx.fubo.tv/league_logos/league_placeholder.png",
    "country": "US",
    "url": "https://www.fubo.tv/welcome/leagues/17203826?irmp=365718&irad=596299",
    "regionalRestrictions": false
  },
  {
    "id": "29664722",
    "title": "New York Yankees vs. Boston Red Sox",
    "hometeam": "New York Yankees",
    "awayteam": "Boston Red Sox",
    "hometeamabbr": "NYY",
    "awayteamabbr": "BOS",
    "hometeamID": "34567",
    "awayteamID": "89012",
    "starttime": "2025-03-13T18:00:00Z",
    "endtime": "2025-03-13T21:00:00Z",
    "sport": "Baseball",
    "league": "MLB",
    "league_id": "17203828",
    "network": "ESPN",
    "networkUrl": "https://www.fubo.tv/welcome/channel/espn?irmp=365718&irad=596299",
    "matchId": "EP032826920343",
    "matchUrl": "https://www.fubo.tv/welcome/matches/EP032826920343?irmp=365718&irad=596299",
    "thumbnail": "https://imgx.fubo.tv/league_logos/league_placeholder.png",
    "country": "US",
    "url": "https://www.fubo.tv/welcome/leagues/17203828?irmp=365718&irad=596299",
    "regionalRestrictions": false
  },
  {
    "id": "29664723",
    "title": "Los Angeles Lakers vs. Golden State Warriors",
    "hometeam": "Los Angeles Lakers",
    "awayteam": "Golden State Warriors",
    "hometeamabbr": "LAL",
    "awayteamabbr": "GSW",
    "hometeamID": "45678",
    "awayteamID": "90123",
    "starttime": "2025-03-14T00:00:00Z",
    "endtime": "2025-03-14T03:00:00Z",
    "sport": "Basketball",
    "league": "NBA",
    "league_id": "17203829",
    "network": "TNT",
    "networkUrl": "https://www.fubo.tv/welcome/channel/tnt?irmp=365718&irad=596299",
    "matchId": "EP032826920344",
    "matchUrl": "https://www.fubo.tv/welcome/matches/EP032826920344?irmp=365718&irad=596299",
    "thumbnail": "https://imgx.fubo.tv/league_logos/league_placeholder.png",
    "country": "US",
    "url": "https://www.fubo.tv/welcome/leagues/17203829?irmp=365718&irad=596299",
    "regionalRestrictions": false
  }
];

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(sampleMatches),
    statusText: ""
  } as Response)
);

describe('Matches Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchMatches', () => {
    it('fetches matches successfully', async () => {
      const matches = await fetchMatches();
      expect(fetch).toHaveBeenCalledWith('/api/matches');
      expect(matches).toEqual(sampleMatches);
      expect(matches.length).toBe(3);
    });

    it('throws an error when fetch fails', async () => {
      // Override fetch mock for this test only
      (global.fetch as jest.Mock).mockImplementationOnce(() => 
        Promise.resolve({
          ok: false,
          statusText: "Not Found"
        } as Response)
      );

      await expect(fetchMatches()).rejects.toThrow('Failed to fetch matches: Not Found');
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      expect(formatDate('2025-03-12T14:00:00Z')).toMatch(/Mar 12, 2025/);
    });
  });

  describe('formatTime', () => {
    it('formats time correctly', () => {
      const formattedTime = formatTime('2025-03-12T14:00:00Z');
      // Note: The exact time might vary by timezone, so we check for format only
      expect(formattedTime).toMatch(/\d{1,2}:\d{2} [AP]M/);
    });
  });

  describe('filterMatchesByDate', () => {
    it('filters matches by date', () => {
      const filtered = filterMatchesByDate(sampleMatches, '2025-03-12');
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('29580438');
    });

    it('returns all matches if no date is provided', () => {
      const filtered = filterMatchesByDate(sampleMatches, '');
      expect(filtered.length).toBe(3);
    });
  });

  describe('filterMatchesBySport', () => {
    it('filters matches by sport', () => {
      const filtered = filterMatchesBySport(sampleMatches, 'Basketball');
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('29664723');
    });

    it('returns all matches if no sport is provided', () => {
      const filtered = filterMatchesBySport(sampleMatches, '');
      expect(filtered.length).toBe(3);
    });
  });

  describe('filterMatchesByLeague', () => {
    it('filters matches by league', () => {
      const filtered = filterMatchesByLeague(sampleMatches, 'MLB');
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('29664722');
    });

    it('returns all matches if no league is provided', () => {
      const filtered = filterMatchesByLeague(sampleMatches, '');
      expect(filtered.length).toBe(3);
    });
  });

  describe('getUniqueSports', () => {
    it('returns unique sports from matches', () => {
      const sports = getUniqueSports(sampleMatches);
      expect(sports).toEqual(['Baseball', 'Basketball', 'Cricket']);
      expect(sports.length).toBe(3);
    });
  });

  describe('getUniqueLeagues', () => {
    it('returns unique leagues from matches', () => {
      const leagues = getUniqueLeagues(sampleMatches);
      expect(leagues).toEqual(['European Cricket League', 'MLB', 'NBA']);
      expect(leagues.length).toBe(3);
    });
  });
}); 