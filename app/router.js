import EmberRouter from '@ember/routing/router';
import config from 'baseball/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('boxscore', { path: '/boxscore/:game_pk' });
  this.route('standings');
  this.route('player', { path: '/player/:player_id' });
});
// TODO: create league leaders route
