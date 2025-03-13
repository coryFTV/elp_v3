import { 
  buildAffiliateLink, 
  buildLeagueUrl, 
  buildMatchUrl, 
  buildNetworkUrl,
  AffiliateParams
} from '@/services/affiliateLinkService';

describe('Affiliate Link Service', () => {
  describe('buildAffiliateLink', () => {
    it('should build a basic league URL with default parameters', () => {
      const params: AffiliateParams = {
        linkType: 'league',
        leagueId: 'nfl'
      };
      
      const url = buildAffiliateLink(params);
      
      expect(url).toContain('https://www.fubo.tv/sports/league/nfl');
      expect(url).toContain('irmp=123456');
      expect(url).toContain('irad=fubo-affiliate');
      expect(url).toContain('utm_source=affiliate');
      expect(url).toContain('utm_medium=partner');
    });
    
    it('should build a match URL with custom parameters', () => {
      const params: AffiliateParams = {
        linkType: 'match',
        matchId: 'match-123',
        impactRadiusId: '654321',
        subId1: 'partner1',
        subId2: 'campaign2',
        utmSource: 'custom-source',
        utmCampaign: 'summer-promo',
        sharedId: 'nfl-match-123'
      };
      
      const url = buildAffiliateLink(params);
      
      expect(url).toContain('https://www.fubo.tv/sports/match/match-123');
      expect(url).toContain('irmp=654321');
      expect(url).toContain('subId1=partner1');
      expect(url).toContain('subId2=campaign2');
      expect(url).toContain('utm_source=custom-source');
      expect(url).toContain('utm_campaign=summer-promo');
      expect(url).toContain('sharedid=nfl-match-123');
    });
    
    it('should build a network URL with all possible parameters', () => {
      const params: AffiliateParams = {
        linkType: 'network',
        networkId: 'fs1',
        impactRadiusId: '987654',
        subId1: 'sub1',
        subId2: 'sub2',
        subId3: 'sub3',
        utmSource: 'network',
        utmMedium: 'banner',
        utmCampaign: 'fall-sports',
        utmContent: 'sidebar',
        utmTerm: 'football',
        irad: 'custom-irad',
        sharedId: 'network-share'
      };
      
      const url = buildAffiliateLink(params);
      
      expect(url).toContain('https://www.fubo.tv/watch/fs1');
      expect(url).toContain('irmp=987654');
      expect(url).toContain('irad=custom-irad');
      expect(url).toContain('subId1=sub1');
      expect(url).toContain('subId2=sub2');
      expect(url).toContain('subId3=sub3');
      expect(url).toContain('utm_source=network');
      expect(url).toContain('utm_medium=banner');
      expect(url).toContain('utm_campaign=fall-sports');
      expect(url).toContain('utm_content=sidebar');
      expect(url).toContain('utm_term=football');
      expect(url).toContain('sharedid=network-share');
    });
    
    it('should correctly encode parameters with special characters', () => {
      const params: AffiliateParams = {
        linkType: 'league',
        leagueId: 'nba',
        subId1: 'partner with spaces',
        utmCampaign: 'summer & fall'
      };
      
      const url = buildAffiliateLink(params);
      
      expect(url).toContain('subId1=partner%20with%20spaces');
      expect(url).toContain('utm_campaign=summer%20%26%20fall');
    });
  });
  
  describe('helper functions', () => {
    it('buildLeagueUrl should create a league URL', () => {
      const url = buildLeagueUrl('nhl', { impactRadiusId: '123456' });
      
      expect(url).toContain('https://www.fubo.tv/sports/league/nhl');
      expect(url).toContain('irmp=123456');
    });
    
    it('buildMatchUrl should create a match URL', () => {
      const url = buildMatchUrl('match-456', { impactRadiusId: '123456', subId1: 'test' });
      
      expect(url).toContain('https://www.fubo.tv/sports/match/match-456');
      expect(url).toContain('irmp=123456');
      expect(url).toContain('subId1=test');
    });
    
    it('buildNetworkUrl should create a network URL', () => {
      const url = buildNetworkUrl('espn', { impactRadiusId: '123456', utmSource: 'test' });
      
      expect(url).toContain('https://www.fubo.tv/watch/espn');
      expect(url).toContain('irmp=123456');
      expect(url).toContain('utm_source=test');
    });
  });
}); 