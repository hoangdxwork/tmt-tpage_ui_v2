const defaultColors = require('tailwindcss/colors')
//màu nào ko dùng thì comment
const COLORTAIWIND = [
    // "blue",
    // "yellow",
    // "red",
    // "gray",
    // "green",
    // "indigo",
    // "purple",
    // "pink"
]

const COLORS = {
    success: {
        100: '#E9F6EC',
        200: '#DFFCE6',
        300: '#88CE97',
        400: '#28A745',
        500: '#20913A',
    },
    info: {
        100: '#E5F2FF',
        200: '#CCE7FF',
        300: '#72B7FB',
        400: '#2395FF',
        500: '#0184FF',
    },
    warning: {
        100: '#FEF6E9',
        200: '#FCF0CB',
        300: '#F8CE8B',
        400: '#FFC107',
        500: '#F3A72E',
    },
    error: {
        100: '#FDEBE9',
        200: '#FCE6EA',
        300: '#F17585',
        400: '#EB3B5B',
        500: '#DA072D ',
    },
    light: {
        50: '#F8F9FB',
        100: '#F0F1F3',
        200: '#EBEDEF',
    },
    dark: {
        600: "#2B3D4D",
        700: '#1C2B36',
        800: "#212E39",
        900: '#131D26',

    },
    primary: {
        1: '#28A745',
        2: '#008E39',
        3: '#F2FCF5',
        4: '#E0F7E7',
        5: '#BDEAC4',
    },
    secondary: {
        1: '#2C80F8',
        2: '#0B5FD7',
        3: '#F6FBFF',
    },
    tertiary: {
        1: '#F59E0B',
        2: '#FCD34D'
    },
    accent: {
        1: '#B5076B',
        2: '#A70000',
        3: '#F33240',
        4: '#FF8900',
        5: '#FFC400',
        6: '#28A745',
        7: '#00875A',
        8: '#0C9AB2',
        9: '#2684FF',
        10: '#034A93',
        11: '#5243AA',
        12: '#42526E'
    },
    gradient: {
        1: '#0051CD',
        2: '#3E89FC'
    },
    base:{
        red:{
            50: "#FFE5EA",
            100: "#FFCAD4",
            200: "#FFA4B5",
            300: "#FF7E96",
            400: "#FA5171",
            500: "#EA264B",
            600: "#E4002B",
            700: "#CB0026",
            800: "#B00021",
            900: "#92001F",
        },
        orange:{
            50: "#FFF0E9",
            100: "#FFE1D2",
            200: "#FFC2A6",
            300: "#FFA479",
            400: "#FF7F44",
            500: "#FF6720",
            600: "#E55716",
            700: "#C9450C",
            800: "#AD3403",
            900: "#942601",
        },
        yellow:{
            50: "#FFFAE4",
            100: "#FFF5CC",
            200: "#FEEB9E",
            300: "#FADF73",
            400: "#FDD840",
            500: "#F8CC1A",
            600: "#F8B91A",
            700: "#E9A800",
            800: "#CC9200",
            900: "#A96F00",
        },
        green:{
            50: "#E9F6EC",
            100: "#D7F5D0",
            200: "#AEE8A0",
            300: "#81D973",
            400: "#52BF50",
            500: "#28A745",
            600: "#008E39",
            700: "#007636",
            800: "#005A24",
            900: "#004926",
        },

        blue:{
            50: "#ECF6FF",
            100: "#DBEFFF",
            200: "#C8E7FF",
            300: "#A3D7FF",
            400: "#70B5FF",
            500: "#3E89FC",
            600: "#0051CD",
            700: "#053C9C",
            800: "#042975",
            900: "#031F5E",
        },

        indigo:{
            50: "#E9EBFF",
            100: "#CFD5FF",
            200: "#B2BBFF",
            300: "#8694FF",
            400: "#6677FF",
            500: "#4C60FD",
            600: "#373EEE",
            700: "#1E1BC0",
            800: "#0F0D88",
            900: "#020061",
        },

        pink:{
            50: "#FFECED",
            100: "#FFDAE6",
            200: "#FFB2CB",
            300: "#FF8DB1",
            400: "#F96594",
            500: "#EF4379",
            600: "#DF1D5B",
            700: "#CA0544",
            800: "#B1033B",
            900: "#940131",
        },

    },
    background:{
        1: '#FFE2F3',
        2: '#FFE7E7',
        3: '#FFEDEE',
        4: '#FFF1D7',
        5: '#FFFAEA',
        6: '#F2FCF5',
        7: '#D5F2E8',
        8: '#C3EAF0',
        9:'#D7E8FF',
        10: '#CADDF1',
        11: '#DFDCF3',
        12: '#DEE3EC'
    },
    'neutral-1': {
        50: "#DDE2E9",
        100: "#CDD3DB",
        200: "#CDD3DB",
        300: "#A1ACB8",
        400: "#929DAA",
        500: "#858F9B",
        600: "#6B7280",
        700: "#5A6271",
        800: "#424752",
        900: "#2C333A",
    },
    'neutral-2': {
        50: "#F2F4F7",
        100: "#E9EDF2",
        200: "#E2E7ED",
        300: "#DFE7EC",
    },
    'neutral-3': {
        50: "#F8F9FB",
        100: "#F0F1F3",
        200: "#EBEDEF",
        300: "#E3E6E9",

    },
    'd-neutral-1': {
        50: "#161B22",
        100: "#21262D",
        200: "#30363D",
        300: "#A1ACB8",
        400: "#6D7681",
        500: "#8B949E",
        600: "#B1BAC4",
        700: "#C8D1D9",
        800: "#DCE4EC",
        900: "#F0F6FC",
    },
    'd-neutral-2': {
        50: "#14181C",
        100: "#1E2328",
        200: "#30363D",
        300: "#4C535B",
    },
    'd-neutral-3': {
        50: "#02040A",
        100: "#0D1116",
        200: "#161B22",
        300: "#21262D",
        400: "#30363D",

    },
    d: {
      primary: {
        1: "#24913E",
        2: "#43A951",
        3: "#0D1E15",
      },
      secondary: {
        1: "#1A6DE3",
        2: "#0051CD",
      },
      tertiary: {
        1: "#F59E0B",
        2: "#FCD34D",
      },
      accent: {
        1: "#D65F1B",
        2: "#72B015",
        //không còn sử dụng từ bản 1.3.0
        3: "#F33240",
        4: "#FF8900",
        5: "#FFC400",
        6: "#28A745",
        7: "#00875A",
        8: "#0C9AB2",
        9: "#2684FF",
        10: "#034A93",
        11: "#5243AA",
        12: "#42526E",
      },
      gradient: {
        1: {
          start: "#0051CD",
          // mid:'',
          end: "#3E89FC",
        },
        2: {
          start: "#28A745",
          // mid:'',
          end: "#52BF50",
        },
      },
      info: {
        100: "#0B1C30",
        200: "#09284C",
        300: "#1A4B7F",
        400: "#277FDC",
        500: "#4292E2",
      },
      success: {
        100: "#0D201C",
        200: "#123121",
        300: "#19552B",
        400: "#24913E",
        500: "#43A951",
      },
      warning: {
        100: "#2C2614",
        200: "#483A18",
        300: "#7A6528",
        400: "#DBAF37",
        500: "#E2BA4C",
      },
      error: {
        100: "#290E19",
        200: "#430D1B",
        300: "#731A2D",
        400: "#C9334C",
        500: "#DF4A61",
      },
      neutral: {
        1: {
          50: "#161B22",
          100: "#21262D",
          200: "#30363D",
          300: "#484F58",
          400: "#6D7681",
          500: "#8B949E",
          600: "#B1BAC4",
          700: "#C8D1D9",
          800: "#DCE4EC",
          900: "#F0F6FC",
        },
        2: {
          50: "#14181C",
          100: "#1E2328",
          200: "#30363D",
          300: "#4C535B",
        },
        3: {
          50: "#02040A",
          100: "#0D1116",
          200: "#161B22",
          300: "#21262D",
          400: "#30363D",
          500: "#484F58",
        },
      },
      base: {
        red: {
          50: "#231017",
          100: "#3B131B",
          200: "#4F181F",
          300: "#701B23",
          400: "#9D1F29",
          500: "#C9242F",
          600: "#E04C51",
          700: "#F37878",
          800: "#F8A4A2",
          900: "#FACECB",
        },
        orange: {
          50: "#251613",
          100: "#3F2014",
          200: "#542C18",
          300: "#783A19",
          400: "#A74C1B",
          500: "#D65E1C",
          600: "#E78242",
          700: "#F3A46C",
          800: "#F8C295",
          900: "#FADBBF",
        },
        amber: {
          50: "#251E13",
          100: "#3F2F12",
          200: "#544015",
          300: "#785715",
          400: "#A77615",
          500: "#D69614",
          600: "#E7B339",
          700: "#F3CC62",
          800: "#F8DF8B",
          900: "#FAEDB5",
        },
        yellow: {
          50: "#2B2915",
          100: "#3F3912",
          200: "#544E16",
          300: "#786C16",
          400: "#A79414",
          500: "#D6BD13",
          600: "#E7D639",
          700: "#F2EA61",
          800: "#F8F48B",
          900: "#FAFAB5",
        },
        lime: {
          50: "#152213",
          100: "#223613",
          200: "#314916",
          300: "#436516",
          400: "#5A8B15",
          500: "#72B015",
          600: "#90C535",
          700: "#B0DB5C",
          800: "#CEEB89",
          900: "#E9FABA",
        },
        green: {
          50: "#0D1D16",
          100: "#112F1A",
          200: "#17411E",
          300: "#1C5923",
          400: "#227828",
          500: "#29982E",
          600: "#48AC49",
          700: "#73C070",
          800: "#9ED09B",
          900: "#CBDFC8",
        },
        teal: {
          50: "#0B1F22",
          100: "#0C3132",
          200: "#0F4341",
          300: "#115C57",
          400: "#127E74",
          500: "#149F90",
          600: "#31B2A0",
          700: "#56C7B3",
          800: "#7FD8C5",
          900: "#ADE7D8",
        },
        sky: {
          50: "#0D1B2E",
          100: "#102947",
          200: "#16385C",
          300: "#1A4B7F",
          400: "#2065AD",
          500: "#267FDC",
          600: "#4B9CE8",
          700: "#75BAF3",
          800: "#9FD3F8",
          900: "#C8E7FA",
        },
        blue: {
          50: "#0C142A",
          100: "#0F1D42",
          200: "#142856",
          300: "#173375",
          400: "#1B42A0",
          500: "#2051CA",
          600: "#4778E1",
          700: "#73A0F3",
          800: "#9DC0F8",
          900: "#C5DCFA",
        },
        indigo: {
          50: "#0F1128",
          100: "#16153D",
          200: "#1F1B51",
          300: "#28206E",
          400: "#342695",
          500: "#402DBC",
          600: "#6753D1",
          700: "#947FE7",
          800: "#C0B0F8",
          900: "#E3DAFA",
        },
        purple: {
          50: "#151127",
          100: "#22143B",
          200: "#2F1A4E",
          300: "#401E6A",
          400: "#572490",
          500: "#6E2AB5",
          600: "#904DCA",
          700: "#B37AE0",
          800: "#D4A8F0",
          900: "#EDD7FA",
        },
        pink: {
          50: "#231122",
          100: "#3B1430",
          200: "#501A3C",
          300: "#711E4F",
          400: "#9D2468",
          500: "#CA2A81",
          600: "#E05299",
          700: "#F37FB6",
          800: "#F8A8CB",
          900: "#FAD2E3",
        },
      },
    },
};

function genarateColorTDS() {
    var colors = [];
    for (const colorName in COLORS) {
        for (const colorOpacity in COLORS[colorName]) {
            colors.push(`${colorName}-${colorOpacity}`)
        }
    }
    if (COLORTAIWIND.length > 0) {

        for (let index = 0; index < COLORTAIWIND.length; index++) {
            const colorName = COLORTAIWIND[index];
            if (defaultColors[colorName])
                for (const colorOpacity in defaultColors[colorName]) {
                    colors.push(`${colorName}-${colorOpacity}`)
                }
        }
    }
    var prefixs = [
        'ring',
        'bg',
        'border',
        'text',
        'focus:bg',
        'focus:border',
        'hover:border',
        'hover:bg',
        'disabled:bg',
        'disabled:border',
        'dark:bg',
        'dark:text',
        'dark:border',
        'dark:group-hover:text',
        'dark:hover:bg',
        'dark:hover:text'
    ]

    var result = [];
    for (let index = 0; index < prefixs.length; index++) {
        const prefix = prefixs[index];
        for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
            const color = colors[colorIndex];
            result.push(prefix + "-" + color);
        }
    }

    return result;
}
const colorTDS = genarateColorTDS();

const SAFELISTING = [
    // 'ring-opacity-20',
    // 'focus:ring',
    // 'disabled:opacity-65',
    // 'hover:bg-primary-2',
    // 'bg-primary-2',
    // 'focus:bg-primary-2',
    // 'border-primary-2',
    // 'hover:border-primary-2',
    // 'dark:hover:bg-d-neutral-3-700',
    // 'border-b-3',
    // 'border-l-3',
    // 'border-r-3',
    // 'border-t-3',
    // 'border-3',
    // 'h-2',
    // 'w-2',
    // ...colorTDS
]
module.exports = {
    // prefix: '',
    // enabled: process.env.NODE_ENV && process.env.NODE_ENV.trim() === "production",
    content: [
        './src/**/*.{html,ts}',
        './node_modules/tds-ui/fesm2015/*.{html,ts,js,mjs}',
        './node_modules/omnichannel/fesm2015/*.{html,ts,js,mjs}'
    ],
    safelist: SAFELISTING,
    darkMode: 'class',
    theme: {
        extend: {
            zIndex: {
                '60': 60,
                '9999': 9999,
                '1000': 1000
            },
            colors: {
                ...COLORS
            },
            ringColor: {
                ...COLORS
            },
            borderColor: {
                ...COLORS,
            },
            boxShadow: {
                'primary': '0px 0px 0px 3px rgba(40, 167, 69, 0.2)',
                'success': '0px 0px 0px 3px rgba(40, 167, 69, 0.2)',
                'error': '0px 0px 0px 3px rgba(235, 59, 91, 0.2)',
                'info': '0px 0px 0px 3px rgba(35, 149, 255, 0.2)',
                'warning': '0px 0px 0px 3px rgba(255, 193, 7, 0.2)',
                '1-lg': '0px 1px 10px rgba(29, 45, 73, 0.102)',
                '1-sm': '0px 1px 3px rgba(29, 45, 73, 0.102)',
                '1-md': '0px 1px 3px rgba(29, 45, 73, 0.102)',
                '1-xl': '0px 1px 15px rgba(29, 45, 73, 0.14)',
            },
            minWidth: {
                '5': '1.25rem',
                '7': '1.75rem',
                '32': '8rem',
                20: '5rem',
                100: '100px',
                170: '170px',
            },
            minHeight: {
                24: "24px",
                '7': '1.75rem',
            },
            opacity: {
                '65': '.65',
                '9' : '.09',
            },
            fontSize: {
                'heading-1': ['40px', '53px'],
                'heading-2': ['32px', '43px'],
                'heading-3': ['28px', '37px'],
                'heading-4': ['24px', '32px'],
                'header-1': ['20px', '28px'],
                'header-2': ['18px', '28px'],
                'body-1': ['16px', '24px'],
                'body-2': ['14px', '20px'],
                'title-1': ['16px', '24px'],
                'caption-1': ['13px', '20px'],
                'caption-2': ['12px', '16px'],
            },
            placeholderColor: {
                ...COLORS
            },
            ringWidth: {
                '3': '3px'
            },
            height: {
                sm: '30px',
                md: '34px',
                lg: '38px'
            },
            borderRadius: {
                '10': "0.625rem",
                '20': "1.25rem",
            },
            fontWeight: {
                regular: 400
            },
            borderWidth: {
                3: "3px"
            },
            screens: {
              'desktop':'1620px',
              'laptop': [
                {'min':'1280px', 'max':'1619px'}
              ],
              'tablet': [
                {'min':'640px', 'max':'1279px'}
              ],
            }
        },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      require('@tailwindcss/line-clamp')
    ],
};
