// require('dotenv').config()
const webpack = require('webpack')

module.exports = {
	mode: 'spa',

	/*
	 ** Headers of the page
	 */
	head: {
		title: 'OneNames',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: 'OneNames.' }
		],
		link: [
			{
				rel: 'stylesheet',
				href:
					'https://fonts.googleapis.com/css?family=Overpass:100,200,300,400,600,700,800,900|Overpass+Mono:300,400'
			},
			{
				rel: 'stylesheet',
				href:
					'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
			}
		]
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
	plugins: [{ src: './plugins/subdomain.js' }],
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