const colors = require('tailwindcss/colors')

function getContrastYIQ(hex) {
  hex = hex.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
  return yiq >= 128 ? 'black' : 'white'
}

const mlbColors = {
  nyy: { main: '#FFFFFF', secondary: '#0C2340', 'text-main': '#0C2340' },
  tb: { main: '#092C5C', secondary: '#8FBCE6' },
  tor: { main: '#134A8E', secondary: '#E8291C' },
  bos: { main: '#BD3039', secondary: '#0C2340' },
  bal: { main: '#DF4601', secondary: '#000000' },
  min: { main: '#002B5C', secondary: '#D31145' },
  cws: { main: '#27251F', secondary: '#C4CED4' },
  cle: { main: '#0C2340', secondary: '#E31937' },
  kc: { main: '#004687', secondary: '#BD9B60' },
  det: { main: '#0C2340', secondary: '#FA4616' },
  oak: { main: '#003831', secondary: '#EFB21E' },
  sea: { main: '#0C2C56', secondary: '#005C5C' },
  tex: { main: '#003278', secondary: '#C0111F' },
  laa: { main: '#BA0021', secondary: '#003263' },
  hou: { main: '#EB6E1F', secondary: '#002D62' },
  phi: { main: '#E81828', secondary: '#002D72' },
  mia: { main: '#00A3E0', secondary: '#000000' },
  atl: { main: '#CE1141', secondary: '#13274F' },
  nym: { main: '#FF5910', secondary: '#002D72' },
  pit: { main: '#FDB827', secondary: '#27251F' },
  wsh: { main: '#AB0003', secondary: '#14225A' },
  stl: { main: '#C41E3A', secondary: '#0C2340' },
  mil: { main: '#12284B', secondary: '#FFC52F' },
  chc: { main: '#0E3386', secondary: '#CC3433' },
  cin: { main: '#C6011F', secondary: '#000000' },
  sd: { main: '#2F241D', secondary: '#FFC425' },
  sf: { main: '#27251F', secondary: '#FD5A1E' },
  ari: { main: '#A71930', secondary: '#E3D4AD' },
  col: { main: '#33006F', secondary: '#C4CED4' },
  lad: { main: '#005A9C', secondary: '#A5ACAF' },
  nl: { main: '#002D72', secondary: '#D50032' },
  al: { main: '#D50032', secondary: '#002D72' }
}
// TODO: Make highlight color variable for each team, apply to team name/borders/stuff for highlights

Object.keys(mlbColors).forEach(key => {
  if (!mlbColors[key]['text-main']) {
    mlbColors[key]['text-main'] = getContrastYIQ(mlbColors[key].main)
  }

  if (!mlbColors[key]['text-secondary']) {
    mlbColors[key]['text-secondary'] = getContrastYIQ(mlbColors[key].secondary)
  }
})

module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.vue',
    './src/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.stone,
        ...mlbColors
      },
      boxShadow: {
        'md-side': '4px 0 6px -1px rgba(0, 0, 0, 0.1), 2px 0 4px -1px rgba(0, 0, 0, 0.06)',
      },
      height: {
        'content': 'calc(100vh - 12.5rem)',
        'home': 'calc(100vh - 2rem)',
        'leaders': 'calc(100vh - 6.5rem)'
      },
      padding: {
        '2.5': '0.625rem',
        '5.5': '1.375rem'
      },
      minHeight: {
        'leader-select': '2.625rem',
        'locale-select': '2rem'
      },
      fontFamily: {
        'body': 'Inconsolata, Menlo, Monaco, ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", "Courier New", monospace'
      },
      stroke: {
        black: colors.black,
        white: colors.white
      },
      fill: {
        black: colors.black,
        white: colors.white
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
