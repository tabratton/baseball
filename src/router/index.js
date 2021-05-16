import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'
import LeagueLeaders from '../views/LeagueLeaders.vue'
import Player from '../views/Player.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/game/:gamepk',
    name: 'Game',
    component: Game
  },
  {
    path: '/league-leaders',
    name: 'League Leaders',
    component: LeagueLeaders
  },
  {
    path: '/player/:playerId',
    name: 'Player',
    component: Player
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
