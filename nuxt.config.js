// require('dotenv').config()
const webpack = require('webpack')

module.exports = {
	mode: 'spa',

	/*
  ** Headers of the page
  */
	head: {
		title: 'OneName'
	},
	/*
  ** Customize the progress-bar color
  */
	loading: { color: '#1946FF' },
	/*
  ** Global CSS
  */
	css: [],

	/*
  ** Plugins to load before mounting the App
  */
	plugins: [{ src: './plugins/web3.js' }],
	/*
  ** Nuxt.js dev-modules
  */
	buildModules: [],

	/*
  ** Nuxt.js modules
  */
	modules: [],

	/*
  ** Build configuration
  */
	build: {
		collapseBooleanAttributes: true,
		decodeEntities: true,
		minifyCSS: true,
		minifyJS: true,
		processConditionalComments: true,
		removeEmptyAttributes: true,
		removeRedundantAttributes: true,
		trimCustomFragments: true,
		useShortDoctype: true,
		extractCSS: true,
		extend(config, ctx) {},
		plugins: [
			new webpack.ProvidePlugin({
				_: 'lodash'
			})
		]
	},
	srcDir: 'src/',
	rootDir: './'
}
