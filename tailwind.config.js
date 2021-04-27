module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue', './src/**/*.js'] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        oak: {
          main: '#003831',
          secondary: '#EFB21E'
        },
        pit: {
          main: '#FDB827',
          secondary: '#27251F'
        },
        sd: {
          main: '#2F241D',
          secondary: '#FFC425'
        },
        sea: {
          main: '#005C5C',
          secondary: '#0C2C56'
        },
        sf: {
          main: '#FD5A1E',
          secondary: '#27251F'
        },
        stl: {
          main: '#C41E3A',
          secondary: '#0C2340'
        },
        tb: {
          main: '#092C5C',
          secondary: '#8FBCE6'
        },
        tex: {
          main: '#003278',
          secondary: '#C0111F'
        },
        tor: {
          main: '#134A8E',
          secondary: '#E8291C'
        },
        min: {
          main: '#002B5C',
          secondary: '#D31145'
        },
        phi: {
          main: '#E81828',
          secondary: '#002D72'
        },
        atl: {
          main: '#CE1141',
          secondary: '#13274F'
        },
        cws: {
          main: '#27251F',
          secondary: '#C4CED4'
        },
        mia: {
          main: '#00A3E0',
          secondary: '#EF3340'
        },
        nyy: {
          main: '#003087',
          secondary: '#E4002C'
        },
        mil: {
          main: '#12284B',
          secondary: '#FFC52F'
        },
        laa: {
          main: '#BA0021',
          secondary: '#003263'
        },
        ari: {
          main: '#A71930',
          secondary: '#E3D4AD'
        },
        bal: {
          main: '#DF4601',
          secondary: '#000000'
        },
        bos: {
          main: '#BD3039',
          secondary: '#0C2340'
        },
        chc: {
          main: '#0E3386',
          secondary: '#CC3433'
        },
        cin: {
          main: '#C6011F',
          secondary: '#000000'
        },
        cle: {
          main: '#0C2340',
          secondary: '#E31937'
        },
        col: {
          main: '#33006F',
          secondary: '#C4CED4'
        },
        det: {
          main: '#0C2340',
          secondary: '#FA4616'
        },
        hou: {
          main: '#EB6E1F',
          secondary: '#002D62'
        },
        kc: {
          main: '#004687',
          secondary: '#BD9B60'
        },
        lad: {
          main: '#005A9C',
          secondary: '#A5ACAF'
        },
        wsh: {
          main: '#AB0003',
          secondary: '#14225A'
        },
        nym: {
          main: '#FF5910',
          secondary: '#002D72'
        }
      },
      boxShadow: {
        'md-side': '4px 0 6px -1px rgba(0, 0, 0, 0.1), 2px 0 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
